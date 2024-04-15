using System;
using System.Collections.Generic;

namespace InfoTrackSEOAPI.Models;

public partial class Fetch
{
    public int Id { get; set; }

    public int SearchId { get; set; }

    public int TimeStamp { get; set; }

    public virtual ICollection<FetchHit> FetchHits { get; set; } = new List<FetchHit>();

    public virtual Search Search { get; set; } = null!;
}
