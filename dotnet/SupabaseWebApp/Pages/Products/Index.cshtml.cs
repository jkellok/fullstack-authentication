using Microsoft.AspNetCore.Mvc.RazorPages;
using SupabaseWebApp.Services;
using SupabaseWebApp.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace SupabaseWebApp.Pages.Products
{
    [Authorize]
    public class IndexModel : PageModel
    {
        private readonly SupabaseService _supabaseService;

        public IndexModel(SupabaseService supabaseService)
        {
            _supabaseService = supabaseService;
        }

        public IList<Product> Products { get; set; }

        public async Task OnGetAsync()
        {
            Products = (await _supabaseService.GetData()).ToList();
        }
    }
}
