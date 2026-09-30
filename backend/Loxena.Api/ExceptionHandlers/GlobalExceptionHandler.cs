using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Loxena.Api.ExceptionHandlers;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "Uma exceção foi capturada: {Message}", exception.Message);

        var (statusCode, title, detail) = exception switch
        {
            InvalidOperationException ex => (StatusCodes.Status400BadRequest, "Regra de negócio violada", ex.Message),
            ArgumentException ex => (StatusCodes.Status400BadRequest, "Dados inválidos", ex.Message),
            DbUpdateConcurrencyException => (StatusCodes.Status409Conflict, "Conflito de Concorrência", "O registro foi alterado por outra operação simultânea. Recarregue os dados e tente novamente."),
            _ => (StatusCodes.Status500InternalServerError, "Erro Interno do Servidor", "Ocorreu um erro interno inesperado.")
        };

        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = detail, 
            Instance = httpContext.Request.Path
        };

        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }
}
