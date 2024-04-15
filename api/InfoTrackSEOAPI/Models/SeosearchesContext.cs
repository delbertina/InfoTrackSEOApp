using Microsoft.EntityFrameworkCore;

namespace InfoTrackSEOAPI.Models;

public partial class SeosearchesContext : DbContext
{
    public SeosearchesContext()
    {
    }

    public SeosearchesContext(DbContextOptions<SeosearchesContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Fetch> Fetches { get; set; }

    public virtual DbSet<FetchHit> FetchHits { get; set; }

    public virtual DbSet<Search> Searches { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=.\\SEOSearches.db");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Fetch>(entity =>
        {
            entity.ToTable("Fetch");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.SearchId).HasColumnName("search_id");
            entity.Property(e => e.TimeStamp).HasColumnName("time_stamp");

            entity.HasOne(d => d.Search).WithMany(p => p.Fetches).HasForeignKey(d => d.SearchId);
        });

        modelBuilder.Entity<FetchHit>(entity =>
        {
            entity.ToTable("FetchHit");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FetchId).HasColumnName("fetch_id");
            entity.Property(e => e.HitIndex).HasColumnName("hit_index");

            entity.HasOne(d => d.Fetch).WithMany(p => p.FetchHits).HasForeignKey(d => d.FetchId);
        });

        modelBuilder.Entity<Search>(entity =>
        {
            entity.ToTable("Search");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.SearchDomain).HasColumnName("search_domain");
            entity.Property(e => e.SearchQuery).HasColumnName("search_query");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
