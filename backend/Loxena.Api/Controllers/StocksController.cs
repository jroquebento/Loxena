using Loxena.Application.Stocks.UseCases.AddStock;
using Loxena.Application.Stocks.UseCases.GetStockById;
using Loxena.Application.Stocks.UseCases.GetStockByProductId;
using Loxena.Application.Stocks.UseCases.GetStocks;
using Loxena.Application.Stocks.UseCases.RemoveStock;
using Loxena.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Loxena.Api.Controllers;

[Route("[controller]")]
[ApiController]
public class StocksController : ControllerBase
{
    private readonly AddStockUseCase _addStockUseCase;
    private readonly RemoveStockUseCase _removeStockUseCase;
    private readonly GetStocksUseCase _getStocksUseCase;
    private readonly GetStockByIdUseCase _getStockByIdUseCase;
    private readonly GetStockByProductIdUseCase _getStockByProductIdUseCase;

    public StocksController(
        AddStockUseCase addStockUseCase,
        RemoveStockUseCase removeStockUseCase,
        GetStocksUseCase getStocksUseCase,
        GetStockByIdUseCase getStockByIdUseCase,
        GetStockByProductIdUseCase getStockByProductIdUseCase)
    {
        _addStockUseCase = addStockUseCase;
        _removeStockUseCase = removeStockUseCase;
        _getStocksUseCase = getStocksUseCase;
        _getStockByIdUseCase = getStockByIdUseCase;
        _getStockByProductIdUseCase = getStockByProductIdUseCase;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddStock(AddStockRequest request)
    {
        var stock = await _addStockUseCase.ExecuteAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = stock.Id }, stock);
    }

    [HttpPost("remove")]
    public async Task<IActionResult> RemoveStock(RemoveStockRequest request)
    {
        var stock = await _removeStockUseCase.ExecuteAsync(request);
        return Ok(stock);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var stocks = await _getStocksUseCase.ExecuteAsync();
        return Ok(stocks);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id) 
    {
        var stock = await _getStockByIdUseCase.ExecuteAsync(id);

        if (stock is null)
            return NotFound();

        return Ok(stock);
    }

    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetByProductId(Guid productId) 
    {
        var stocks = await _getStockByProductIdUseCase.ExecuteAsync(productId);
        return Ok(stocks);
    }
}
