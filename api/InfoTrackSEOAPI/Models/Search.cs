using System;
using System.Collections.Generic;

namespace InfoTrackSEOAPI.Models;

public partial class Search
{
    public int Id { get; set; }

    public string SearchQuery { get; set; } = null!;

    public string SearchDomain { get; set; } = null!;

    public virtual ICollection<Fetch> Fetches { get; set; } = new List<Fetch>();
}
