using InfoTrackSEOAPI.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace InfoTrackSEOAPI.Controllers
{
    [EnableCors()]
    [ApiController]
    [Route("[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly ILogger<SearchController> _logger;
        private readonly SeosearchesContext _context;

        public SearchController(ILogger<SearchController> logger, SeosearchesContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet("list")]
        public async Task<ActionResult<IEnumerable<Search>>> GetSearchList()
        {
            return await _context.Searches
                .Include(x => x.Fetches)
                .ThenInclude(x => x.FetchHits)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Search>> GetSearch(long id)
        {
            var searchItem = await _context.Searches
                .Include(x => x.Fetches)
                .ThenInclude(x => x.FetchHits)
                .FirstOrDefaultAsync(x => x.Id == (int)id);

            if (searchItem == null)
            {
                return NotFound();
            }

            return searchItem;
        }

        [HttpPost]
        public async Task<ActionResult<Search>> PostSearch(Search search)
        {
            search.Id = 0; // Make sure the id is 0 so it is automatically assigned

            // Sanitize the URL and if nothing usable remains, send back error
            search.SearchDomain = SanitizeURL(search.SearchDomain);
            if (String.IsNullOrEmpty(search.SearchDomain))
            {
                return BadRequest();
            }

            _context.Searches.Add(search);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSearch), new { id = search.Id }, search);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSearch(long id, Search search)
        {
            if ((int)id != search.Id)
            {
                return BadRequest();
            }

            // Sanitize the URL and if nothing usable remains, send back error
            search.SearchDomain = SanitizeURL(search.SearchDomain);
            if (String.IsNullOrEmpty(search.SearchDomain))
            {
                return BadRequest();
            }

            _context.Entry(search).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SearchExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSearch(long id)
        {
            var search = await _context.Searches.FindAsync((int)id);
            if (search == null)
            {
                return NotFound();
            }

            _context.Searches.Remove(search);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SearchExists(long id)
        {
            return _context.Searches.Any(e => e.Id == (int)id);
        }

        private string SanitizeURL(string url)
        {
            var pattern = @"(?:http[s]?:\/\/)?(?:www\.)?([[A-z0-9\.-]*\.[0-9A-z]+)";
            var match = Regex.Match(url, pattern);
            var group = match.Groups[1].Value;
            return group;
        }
    }
}
