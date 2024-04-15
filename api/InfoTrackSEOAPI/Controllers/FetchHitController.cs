using InfoTrackSEOAPI.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InfoTrackSEOAPI.Controllers
{
    [EnableCors()]
    [ApiController]
    [Route("[controller]")]
    public class FetchHitController : ControllerBase
    {
        private readonly ILogger<SearchController> _logger;
        private readonly SeosearchesContext _context;

        public FetchHitController(ILogger<SearchController> logger, SeosearchesContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FetchHit>> GetFetchHit(long id)
        {
            var fetchHitItem = await _context.FetchHits.FindAsync((int)id);

            if (fetchHitItem == null)
            {
                return NotFound();
            }

            return fetchHitItem;
        }

        [HttpPost]
        public async Task<ActionResult<FetchHit>> PostFetchHit(FetchHit fetchHit)
        {
            // If the fetch associated with this new hit does not exist
            var fetchItem = await _context.Fetches.FindAsync(fetchHit.FetchId);

            if (fetchItem == null)
            {
                return NotFound();
            }

            _context.FetchHits.Add(fetchHit);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFetchHit), new { id = fetchHit.Id }, fetchHit);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutFetchHit(long id, FetchHit fetchHit)
        {
            // If the fetch associated with this hit does not exist
            var fetchItem = await _context.Fetches.FindAsync(fetchHit.FetchId);

            if (fetchItem == null)
            {
                return NotFound();
            }
            // If the fetch the user is trying to edit does not exist
            if ((int)id != fetchHit.Id)
            {
                return BadRequest();
            }

            _context.Entry(fetchHit).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FetchHitExists(id))
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
        public async Task<IActionResult> DeleteFetchHit(long id)
        {
            var fetchHit = await _context.FetchHits.FindAsync((int)id);
            if (fetchHit == null)
            {
                return NotFound();
            }

            _context.FetchHits.Remove(fetchHit);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FetchHitExists(long id)
        {
            return _context.FetchHits.Any(e => e.Id == (int)id);
        }
    }
}
