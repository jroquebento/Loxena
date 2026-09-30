namespace Loxena.Application.Locations.UseCases.CreateLocation;

public class CreateLocationRequest
{
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
}
