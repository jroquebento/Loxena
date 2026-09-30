namespace Loxena.Application.Products.UseCases.CreateProduct;

public class CreateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public Guid CategoryId { get; set; }
}
