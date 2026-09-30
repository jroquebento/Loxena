namespace Loxena.Application.Locations.UseCases.UpdateLocation;

public class UpdateLocationRequest
{
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
}
