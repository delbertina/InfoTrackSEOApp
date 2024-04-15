export interface Search {
  id: number;
  searchQuery: string;
  searchDomain: string;
  fetches: Array<Fetch>;
}

export interface Fetch {
  id: number;
  searchId: number;
  timeStamp: number;
  fetchHits: Array<FetchHit>;
}

export interface FetchHit {
  id: number;
  fetchId: number;
  hitIndex: number;
}

export const SearchLoading: Search = {
  id: -1,
  searchQuery: "Loading ...",
  searchDomain: "Loading ...",
  fetches: []
}