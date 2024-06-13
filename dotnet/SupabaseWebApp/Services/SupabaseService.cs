using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text;
using System.Threading.Tasks;
using SupabaseWebApp.Models;
using Microsoft.Extensions.Logging;

namespace SupabaseWebApp.Services
{
    public class SupabaseService
    {
        private readonly HttpClient _httpClient;
        private readonly string _supabaseUrl = "https://cpeydhqgvuycozectguw.supabase.co"; 
        private readonly string _supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZXlkaHFndnV5Y296ZWN0Z3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzMjU1NTQsImV4cCI6MjAzMDkwMTU1NH0.TsxPXoIgX9E6_t8Ih27JAQaM9ly4lpXNcDsepLceMXA"; 
        private readonly ILogger<SupabaseService> _logger;
        
        public SupabaseService(HttpClient httpClient, ILogger<SupabaseService> logger)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri(_supabaseUrl);
            _httpClient.DefaultRequestHeaders.Add("apikey", _supabaseKey);
            _logger = logger;
        }

        public async Task<IEnumerable<Product>> GetData()
        {
            var response = await _httpClient.GetAsync("/rest/v1/Products");  
            
            if (!response.IsSuccessStatusCode)
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to retrieve products. Status Code: {StatusCode}, Response: {ResponseBody}", response.StatusCode, responseBody);
                throw new HttpRequestException($"Response status code does not indicate success: {response.StatusCode}.");
            }

            var responseBodySuccess = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<IEnumerable<Product>>(responseBodySuccess);
        }

        public async Task AddData(Product data)
        {
            var json = JsonSerializer.Serialize(data);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("/rest/v1/Products", content);  // Replace with your table name
            response.EnsureSuccessStatusCode();
        }

        public async Task UpdateData(int id, Product data)
        {
            var json = JsonSerializer.Serialize(data);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PatchAsync($"/rest/v1/Products?id=eq.{id}", content);  // Replace with your table name
            response.EnsureSuccessStatusCode();
        }
    }
}
