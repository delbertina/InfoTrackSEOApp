using InfoTrackSEOAPI.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Text.RegularExpressions;
using System.Web;

namespace InfoTrackSEOAPI.Controllers
{
    [EnableCors()]
    [ApiController]
    [Route("[controller]")]
    public class ScrapeController : ControllerBase
    {
        private readonly SeosearchesContext _context;
        public ScrapeController(SeosearchesContext context)
        {
            _context = context;
        }

        [HttpGet("update/{id}")]
        public async Task<ActionResult> UpdateScrape(long id)
        {
            // Check if search by id exists
            var searchItem = await _context.Searches.FindAsync((int)id);

            if (searchItem == null)
            {
                return NotFound();
            }
            var preparedQuery = HttpUtility.UrlEncode(searchItem.SearchQuery);
            var html = new WebClient().DownloadString("https://www.google.com/search?num=100&q=" + preparedQuery);
            StreamWriter sw = new StreamWriter(".\\StoredOutput\\" + id + ".txt", false);
            sw.WriteLine(html);
            sw.Close();
            return Ok(html);
        }

        [HttpGet("parse/{id}")]
        public async Task<ActionResult<Fetch>> ParseScrape(long id)
        {
            // Check if search by id exists
            var searchItem = await _context.Searches.FindAsync((int)id);

            if (searchItem == null)
            {
                return NotFound();
            }

            var fetchHits = GetHits(id);
            // Get all of the indexes 
            var matchedFetchHits = fetchHits
                    .Select((hit, i) => new { hit, i })
                    .Where(x => x.hit == searchItem.SearchDomain)
                    .Select(x => x.i);
            var newFetch = new Fetch
            {
                Id = 0, // Set to 0 so that it knows to autoincrement 
                TimeStamp = (int)DateTimeOffset.Now.ToUnixTimeSeconds(),
                SearchId = searchItem.Id,
                FetchHits = [],
            };

            _context.Fetches.Add(newFetch);
            _context.Searches.Attach(searchItem);
            await _context.SaveChangesAsync();

            foreach (int hit in matchedFetchHits)
            {
                newFetch.FetchHits.Add(new FetchHit { FetchId = newFetch.Id, HitIndex = hit, Id = 0});
            }


            _context.Entry(newFetch).State = EntityState.Modified;
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

            return newFetch;
        }

        private bool FetchExists(long id)
        {
            return _context.Fetches.Any(e => e.Id == (int)id);
        }

        private IEnumerable<string> GetHits(long id)
        {
            // Genuinely love regex
            //
            // This matches all anchor tags
            // Then finds the start of the domain
            // Only captures in the group up to the closing quotes or a /
            // This makes the solution not reliant on the ever changing list of TLDs
            // This could be changed to capture the full url for storage in the database
            //     if that information ends up being important to the customer
            var pattern = @"<a href=\""\/url\?q=http[s]?:\/\/(?:www\.)?([\^\-\]_.~!*'();:@&=+$,?%#[A-z0-9]*)[\""\/]";
            var fileContents = "";

            if (!System.IO.File.Exists(".\\StoredOutput\\" + id + ".txt"))
            {
                Console.WriteLine("Stored Output file does not exist of ID: ", id.ToString());
                return [];
            }

            try
            {
                StreamReader sr = new StreamReader(".\\StoredOutput\\" + id + ".txt");

                var line = sr.ReadLine();
                while (line != null)
                {
                    fileContents += line;
                    line = sr.ReadLine();
                }
                sr.Close();
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception: " + e.Message);
            }

            var matches = Regex.Matches(fileContents, pattern);
            // Get an array of all of the first groups
            // Filter out any google urls
            //     This is a workaround for the scrape not coming back
            //     with any usable markers for where the search results start and end
            var groups = matches
                .Select(matches => matches.Groups[1].Value)
                .Where(item => !item.Contains("google"));
            return groups;
        }
    }
}
