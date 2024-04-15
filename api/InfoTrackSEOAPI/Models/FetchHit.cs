using System;
using System.Collections.Generic;

namespace InfoTrackSEOAPI.Models;

public partial class FetchHit
{
    public int Id { get; set; }

    public int FetchId { get; set; }

    public int HitIndex { get; set; }

    public virtual Fetch Fetch { get; set; } = null!;
}
