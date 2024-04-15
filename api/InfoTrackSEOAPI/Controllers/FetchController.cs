using InfoTrackSEOAPI.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace InfoTrackSEOAPI.Controllers
{
    [EnableCors()]
    [ApiController]
    [Route("[controller]")]
    public class FetchController : ControllerBase
    {
        private readonly ILogger<SearchController> _logger;
        private readonly SeosearchesContext _context;

        public FetchController(ILogger<SearchController> logger, SeosearchesContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet("list")]
        public async Task<ActionResult<IEnumerable<Fetch>>> GetFetchList()
        {
            return await _context.Fetches
                .Include(x => x.FetchHits)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Fetch>> GetFetch(long id)
        {
            var fetchItem = await _context.Fetches
                .Include(x => x.FetchHits)
                .FirstOrDefaultAsync(x => x.Id == (int)id);

            if (fetchItem == null)
            {
                return NotFound();
            }

            return fetchItem;
        }

        [HttpPost]
        public async Task<ActionResult<Fetch>> PostFetch(Fetch fetch)
        {
            // If the search associated with this fetch does not exist
            var searchItem = await _context.Searches.FindAsync(fetch.SearchId);

            if (searchItem == null)
            {
                return NotFound();
            }

            _context.Fetches.Add(fetch);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFetch), new { id = fetch.Id }, fetch);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutFetch(long id, Fetch fetch)
        {
            if ((int)id != fetch.Id)
            {
                return BadRequest();
            }
            // If the search associated with this fetch does not exist
            var searchItem = await _context.Searches.FindAsync(fetch.SearchId);

            if (searchItem == null)
            {
                return NotFound();
            }

            _context.Entry(fetch).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FetchExists(id))
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
        public async Task<IActionResult> DeleteFetch(long id)
        {
            var fetch = await _context.Fetches.FindAsync((int)id);
            if (fetch == null)
            {
                return NotFound();
            }

            _context.Fetches.Remove(fetch);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FetchExists(long id)
        {
            return _context.Fetches.Any(e => e.Id == (int)id);
        }
    }
}
