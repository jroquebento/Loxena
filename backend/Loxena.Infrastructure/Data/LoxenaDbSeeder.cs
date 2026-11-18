using Loxena.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Loxena.Infrastructure.Data;

public static class LoxenaDbSeeder
{
    public static async Task SeedAsync(LoxenaDbContext context)
    {
        if (await context.Categories.AnyAsync())
            return;

        var categoryInformatica = new Category("Informática e Periféricos");
        var categoryCabos = new Category("Cabos e Conectividade");
        var categoryAudio = new Category("Áudio e Acessórios");
        var categories = new[] { categoryInformatica, categoryCabos, categoryAudio };

        var locations = new[]
        {
            new Location("A-01-1-01", "Rua A, Prédio 01, Nível 1, Vão 01 - Zona Informática"),
            new Location("A-01-1-02", "Rua A, Prédio 01, Nível 1, Vão 02 - Zona Informática"),
            new Location("A-01-2-01", "Rua A, Prédio 01, Nível 2, Vão 01 - Zona Informática"),
            new Location("B-02-1-01", "Rua B, Prédio 02, Nível 1, Vão 01 - Zona Cabos"),
            new Location("B-02-2-03", "Rua B, Prédio 02, Nível 2, Vão 03 - Zona Cabos"),
            new Location("C-01-1-01", "Rua C, Prédio 01, Nível 1, Vão 01 - Zona Áudio"),
            new Location("C-01-1-02", "Rua C, Prédio 01, Nível 1, Vão 02 - Zona Áudio")
        };

        var products = new[]
        {
            new Product("Mouse Sem Fio Óptico 1600 DPI Preto", "Mouse sem fio para uso diário.", 69.90m, categoryInformatica.Id),
            new Product("Teclado Mecânico ABNT2 Switch Brown", "Teclado mecânico com layout ABNT2.", 249.90m, categoryInformatica.Id),
            new Product("Webcam Full HD 1080p com Microfone", "Webcam Full HD com microfone integrado.", 189.00m, categoryInformatica.Id),
            new Product("Cabo HDMI 2.0 Alta Velocidade 2 Metros", "Cabo HDMI 2.0 de dois metros.", 34.90m, categoryCabos.Id),
            new Product("Hub USB-C 6 em 1 com HDMI e Ethernet", "Hub USB-C com conectividade HDMI e Ethernet.", 159.90m, categoryCabos.Id),
            new Product("Headset USB com Cancelamento de Ruído", "Headset USB para comunicação e áudio.", 199.90m, categoryAudio.Id)
        };

        var stocks = new[]
        {
            new Stock(products[0].Id, locations[0].Id, 10),
            new Stock(products[1].Id, locations[1].Id, 10),
            new Stock(products[2].Id, locations[2].Id, 10),
            new Stock(products[3].Id, locations[3].Id, 10),
            new Stock(products[4].Id, locations[4].Id, 10),
            new Stock(products[5].Id, locations[5].Id, 10)
        };

        var customers = new[]
        {
            new Customer("Cliente Demonstração Um", "cliente1@example.com", "12345678909", "(11) 90000-0001"),
            new Customer("Cliente Demonstração Dois", "cliente2@example.com", "98765432100", "(21) 90000-0002"),
            new Customer("Cliente Demonstração Três", "cliente3@example.com", "31415926590", "(31) 90000-0003")
        };

        context.Categories.AddRange(categories);
        context.Locations.AddRange(locations);
        context.Products.AddRange(products);
        context.Stocks.AddRange(stocks);
        context.Customers.AddRange(customers);

        var pickingOrder = new Order(customers[0].Id);
        pickingOrder.AddItem(products[0].Id, stocks[0].Id, 2, products[0].Price);
        pickingOrder.AddItem(products[1].Id, stocks[1].Id, 2, products[1].Price);
        pickingOrder.StartPicking();
        stocks[0].ReserveQuantity(2);
        stocks[1].ReserveQuantity(2);
        pickingOrder.Items.Single(item => item.ProductId == products[0].Id).Pick(1);
        pickingOrder.Items.Single(item => item.ProductId == products[1].Id).Pick(1);

        var packingOrder = new Order(customers[1].Id);
        packingOrder.AddItem(products[2].Id, stocks[2].Id, 2, products[2].Price);
        packingOrder.AddItem(products[3].Id, stocks[3].Id, 2, products[3].Price);
        packingOrder.StartPicking();
        stocks[2].ReserveQuantity(2);
        stocks[3].ReserveQuantity(2);
        packingOrder.Items.Single(item => item.ProductId == products[2].Id).Pick(2);
        packingOrder.Items.Single(item => item.ProductId == products[3].Id).Pick(2);
        packingOrder.StartChecking();
        packingOrder.StartPacking();

        var deliveredOrder = new Order(customers[2].Id);
        deliveredOrder.AddItem(products[4].Id, stocks[4].Id, 1, products[4].Price);
        deliveredOrder.AddItem(products[5].Id, stocks[5].Id, 1, products[5].Price);
        deliveredOrder.StartPicking();
        stocks[4].ReserveQuantity(1);
        stocks[5].ReserveQuantity(1);
        deliveredOrder.Items.Single(item => item.ProductId == products[4].Id).Pick(1);
        deliveredOrder.Items.Single(item => item.ProductId == products[5].Id).Pick(1);
        deliveredOrder.StartChecking();
        deliveredOrder.StartPacking();
        deliveredOrder.Ship();
        stocks[4].FulfillReservation(1);
        stocks[5].FulfillReservation(1);
        deliveredOrder.Deliver();

        context.Orders.AddRange(pickingOrder, packingOrder, deliveredOrder);
        await context.SaveChangesAsync();
    }
}
