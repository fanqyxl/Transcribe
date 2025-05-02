// --- START OF EXISTING types.ts ---

// Response structure (List of Library Playlists)
export interface AMPlaylistsResponse {
  next: string;
  data: AMLibraryPlaylist[];
  meta: {
    total: number;
  };
}

// Playlist attributes (Kept for context, but replaced by detailed versions below)
// export interface AMPlaylistAttributes { ... }

// Artwork object (Kept for context, but replaced by detailed version below)
// export interface AMPlaylistArtwork { ... }

// Play parameters (Kept for context, but replaced by detailed version below)
// export interface AMPlaylistPlayParams { ... }

/**
 * Represents a generic reference to an Apple Music resource type string.
 * Updated with types found in Search results.
 */
export type AMResourceType =
  | 'library-playlists'
  | 'playlists' // Catalog Playlist
  | 'library-songs'
  | 'songs' // Catalog Song
  | 'albums' // Catalog Album
  | 'artists' // Catalog Artist
  | 'music-videos' // Catalog Music Video
  | 'stations' // Catalog Station / Radio Episode
  | 'uploaded-videos' // Catalog Uploaded Video (Connect)
  | 'apple-curators' // Catalog Curator / Radio Show Host
  | 'curators'; // User Curator (Less common via API search)
  // Potentially others like 'activities', 'record-labels', 'tv-episodes', 'music-movies'

/**
 * Represents a generic reference to an Apple Music resource.
 */
export interface AMResourceReference {
  id: string;
  type: AMResourceType;
  href: string;
}

/**
 * Represents artwork details for various Apple Music items.
 * This replaces the simpler AMPlaylistArtwork with a more detailed version.
 * NOTE: The `url` template format can vary slightly between types (e.g., videos might use {c}).
 */
export interface AMArtwork {
  width: number | null; // Can be null for some library items initially
  height: number | null; // Can be null for some library items initially
  url: string; // URL template, requires {w}, {h}, {f} (and sometimes {c} for video) replaced
  bgColor?: string; // Optional background color
  textColor1?: string; // Optional text color 1
  textColor2?: string; // Optional text color 2
  textColor3?: string; // Optional text color 3
  textColor4?: string; // Optional text color 4
  hasP3?: boolean; // Indicates if P3 color space is available (Not always present, default to false if missing)
}


/**
 * Represents playback parameters for an item.
 * This replaces the simpler AMPlaylistPlayParams with a more general version
 * applicable to playlists, songs, albums, videos, stations.
 */
export interface AMPlayParams {
  id: string;
  kind: string; // e.g., 'playlist', 'song', 'album', 'musicVideo', 'radioStation', 'uploadedVideo'
  isLibrary?: boolean;
  globalId?: string; // Catalog ID corresponding to a library item
  versionHash?: string; // For playlists
  catalogId?: string; // For library songs, points to the catalog version
  reporting?: boolean; // For library songs
  reportingId?: string; // For library songs
  format?: string; // For stations (e.g., 'stream', 'tracks')
  stationHash?: string; // For stations
  streamingKind?: number; // For stations (e.g., 1 for Episode)
  mediaType?: number; // For stations (e.g., 0)
  hasDrm?: boolean; // For stations
}


/**
 * Represents a relationship link to other resources.
 */
export interface AMRelationship<T extends AMResourceReference> {
  href: string;
  data: T[];
  meta?: { // Optional meta information, seen for tracks
    total: number;
  };
}

/**
 * Represents the structure for descriptions (standard and short).
 */
export interface AMDescription {
  standard: string;
  short?: string; // Optional short description
}

/**
 * Represents editorial notes for catalog playlists, albums, stations etc.
 * Updated with fields seen in search results.
 */
export interface AMEditorialNotes {
  name?: string; // Sometimes present (e.g., for stations, playlists)
  standard: string;
  short?: string; // Optional short description
  tagline?: string; // Optional tagline (e.g., for stations)
}

// --- Resource Specific Types ---

// -- Playlists --

/**
 * Represents the attributes of a library playlist.
 */
export interface AMLibraryPlaylistAttributes {
  hasCollaboration: boolean;
  isCollaborativeHost: boolean;
  lastModifiedDate: string; // ISO 8601 date string
  canEdit: boolean;
  name: string;
  isPublic: boolean;
  description?: { standard: string }; // Library playlists might only have standard
  canDelete: boolean;
  artwork: AMArtwork;
  hasCatalog: boolean;
  dateAdded: string; // ISO 8601 date string
  playParams: AMPlayParams;
}

export interface AMLibrarySongReference extends AMResourceReference {
  type: 'library-songs';
}

export interface AMCatalogPlaylistReference extends AMResourceReference {
  type: 'playlists';
}

export interface AMLibraryPlaylistRelationships {
  tracks: AMRelationship<AMLibrarySongReference>;
  catalog?: AMRelationship<AMCatalogPlaylistReference>; // Optional catalog link
}

/**
 * Represents a library playlist object.
 */
export interface AMLibraryPlaylist {
  id: string;
  type: 'library-playlists';
  href: string;
  attributes: AMLibraryPlaylistAttributes;
  relationships: AMLibraryPlaylistRelationships;
}

export interface AMCatalogPlaylistAttributes {
  lastModifiedDate: string; // ISO 8601 date string
  supportsSing: boolean;
  description: AMDescription;
  artwork: AMArtwork;
  url: string; // Apple Music URL for the playlist
  playParams: AMPlayParams; // Includes versionHash
  hasCollaboration: boolean;
  curatorName: string;
  audioTraits: string[]; // e.g., ["lossless", "atmos"]
  isChart: boolean;
  name: string;
  playlistType: 'editorial' | 'user-shared' | 'personal-mix' | string; // Common types + fallback
  editorialPlaylistKind?: 'artist-franchise' | string; // Optional, seen for editorial
  editorialNotes?: AMEditorialNotes; // Optional, seen for editorial
}

export interface AMAppleCuratorReference extends AMResourceReference {
  type: 'apple-curators';
}

export interface AMCatalogPlaylistRelationships {
  curator: AMRelationship<AMAppleCuratorReference>;
  // Tracks relationship is typically fetched via a separate endpoint for catalog playlists
}

export interface AMCatalogPlaylist {
  id: string;
  type: 'playlists';
  href: string;
  attributes: AMCatalogPlaylistAttributes;
  relationships: AMCatalogPlaylistRelationships;
}

// -- Songs --

export interface AMLibrarySongAttributes {
  discNumber: number;
  albumName: string;
  genreNames: string[];
  hasLyrics: boolean;
  trackNumber: number;
  releaseDate: string; // YYYY-MM-DD format
  durationInMillis: number;
  name: string;
  artistName: string;
  artwork: AMArtwork;
  playParams: AMPlayParams; // Includes catalogId, reporting info
}

export interface AMCatalogSongReference extends AMResourceReference {
  type: 'songs';
}

export interface AMLibrarySongRelationships {
  catalog?: AMRelationship<AMCatalogSongReference>; // Optional link to catalog version
}

export interface AMLibrarySong {
  id: string;
  type: 'library-songs';
  href: string;
  attributes: AMLibrarySongAttributes;
  relationships: AMLibrarySongRelationships;
}

/**
 * Represents a preview object for a catalog song.
 */
export interface AMCatalogSongPreview {
    url: string;
}

/**
 * Attributes for a Catalog Song. Updated with fields from search results.
 */
export interface AMCatalogSongAttributes {
  durationInMillis: number;
  artistUrl?: string; // URL to the artist page
  artwork: AMArtwork;
  url: string; // Apple Music URL for the song
  name: string; // Name is generally required for catalog songs
  artistName: string; // Artist name generally required
  albumName: string; // Album name generally required
  genreNames: string[];
  releaseDate: string; // YYYY-MM-DD format
  trackNumber: number;
  discNumber: number;
  hasLyrics: boolean;
  playParams: AMPlayParams;
  // New fields from search results:
  hasTimeSyncedLyrics?: boolean;
  isVocalAttenuationAllowed?: boolean;
  isMasteredForItunes?: boolean; // Older flag
  isAppleDigitalMaster?: boolean; // Newer flag
  isrc?: string;
  audioLocale?: string;
  composerName?: string;
  audioTraits?: string[]; // e.g., ["lossless", "lossy-stereo", "hi-res-lossless"]
  previews?: AMCatalogSongPreview[];
}

export interface AMArtistReference extends AMResourceReference {
  type: 'artists';
}

// Reference type for Albums needed for Song relationships
export interface AMAlbumReference extends AMResourceReference {
    type: 'albums';
}

export interface AMCatalogSongRelationships {
  artists: AMRelationship<AMArtistReference>;
  albums: AMRelationship<AMAlbumReference>; // Albums relationship also exists
}

export interface AMCatalogSongMeta {
  contentVersion: {
    MZ_INDEXER: number;
    RTCI: number;
  };
}

export interface AMCatalogSong {
  id: string;
  type: 'songs';
  href: string;
  attributes: AMCatalogSongAttributes;
  relationships: AMCatalogSongRelationships;
  meta?: AMCatalogSongMeta; // Optional meta information
}

// -- Curators --

/**
 * Attributes for an Apple Curator. Updated with fields from search results.
 */
export interface AMAppleCuratorAttributes {
  kind: string; // e.g., 'Genre', 'Show'
  name: string;
  artwork: AMArtwork;
  shortName?: string; // Optional short name
  url: string; // Apple Music URL for the curator
  // New fields from search results:
  showHostName?: string;
  editorialNotes?: AMEditorialNotes; // Includes tagline
}

export interface AMAppleCurator {
  id: string;
  type: 'apple-curators';
  href: string;
  attributes: AMAppleCuratorAttributes;
  // relationships might exist
}

// -- Artists --

/**
 * Attributes for an Artist. Updated with fields from search results.
 */
export interface AMArtistAttributes {
  genreNames?: string[]; // Genre names seem optional in search results
  name: string;
  artwork: AMArtwork;
  url: string; // Apple Music URL for the artist
}

export interface AMArtist {
  id: string;
  type: 'artists';
  href: string;
  attributes: AMArtistAttributes;
  // relationships might exist (e.g., albums, playlists)
}

// -- Albums (NEW from Search Results) --

export interface AMAlbumAttributes {
  trackCount: number;
  releaseDate: string; // YYYY-MM-DD format
  artistUrl?: string; // Optional artist URL
  editorialArtwork?: object; // Often empty object {}
  name: string;
  artistName: string;
  artwork: AMArtwork;
  editorialNotes?: AMEditorialNotes; // Can include short/standard
  url: string; // Apple Music URL for the album
  playParams: AMPlayParams;
  // Potentially other fields like isSingle, genreNames, isComplete, upc
}

export interface AMAlbumRelationships {
  artists: AMRelationship<AMArtistReference>;
  // tracks relationship usually fetched separately
}

export interface AMAlbumMeta {
  contentVersion?: { // Optional in search results
    RTCI: number;
    MZ_INDEXER: number;
  };
}

export interface AMAlbum {
  id: string;
  type: 'albums';
  href: string;
  attributes: AMAlbumAttributes;
  relationships?: AMAlbumRelationships; // Relationships might be optional depending on fetch
  meta?: AMAlbumMeta;
}

// -- Music Videos (NEW from Search Results) --

// Specific artwork type for video previews might be needed if distinct enough
export interface AMVideoPreviewArtwork extends AMArtwork {
    // Potentially different fields or constraints
}

export interface AMVideoPreview {
    url: string;
    hlsUrl?: string;
    artwork?: AMVideoPreviewArtwork; // Use extended Artwork
}

export interface AMMusicVideoAttributes {
  genreNames: string[];
  releaseDate: string; // YYYY-MM-DD format
  durationInMillis: number;
  isrc?: string;
  artwork: AMArtwork; // Use common AMArtwork, note URL format difference in comments
  url: string; // Apple Music URL for the video
  playParams: AMPlayParams;
  has4K: boolean;
  artistUrl?: string;
  hasHDR: boolean;
  name: string;
  previews?: AMVideoPreview[];
  artistName: string;
  videoTraits?: string[]; // e.g., []
}

export interface AMMusicVideoRelationships {
  artists: AMRelationship<AMArtistReference>;
  // albums relationship might also exist
}

export interface AMMusicVideoReference extends AMResourceReference {
    type: 'music-videos';
}

export interface AMMusicVideo {
  id: string;
  type: 'music-videos';
  href: string;
  attributes: AMMusicVideoAttributes;
  relationships?: AMMusicVideoRelationships;
}

// -- Stations (NEW from Search Results) --

export interface AMStationAirTime {
    start: string; // ISO 8601
    end: string; // ISO 8601
}

export interface AMStationAttributes {
  // Fields for Episodes
  airTime?: AMStationAirTime;
  streamingRadioSubType?: 'Episode' | string;
  durationInMillis?: number;
  episodeNumber?: string | number; // Seen as string sometimes
  // Fields for Editorial Stations
  isLive?: boolean;
  mediaKind: 'audio' | string; // Typically 'audio'
  artwork: AMArtwork; // Use common AMArtwork, note URL format difference in comments
  url: string; // Apple Music URL for the station/episode
  playParams: AMPlayParams; // Includes stationHash, format etc.
  requiresSubscription: boolean;
  radioUrl?: string; // itsradio:// URL
  name: string;
  contentRating?: 'explicit' | 'clean';
  editorialNotes?: AMEditorialNotes; // Includes tagline
  supportedDrms?: ('fairplay' | 'playready' | 'widevine')[];
  kind: 'streaming' | 'editorial' | string; // 'streaming' for episodes, 'editorial' for stations
}

export interface AMStationRelationships {
  // Points to the 'show' curator for episodes/shows
  'radio-show'?: AMRelationship<AMAppleCuratorReference>;
}

export interface AMStationReference extends AMResourceReference {
    type: 'stations';
}

export interface AMStation {
  id: string;
  type: 'stations';
  href: string;
  attributes: AMStationAttributes;
  relationships?: AMStationRelationships;
}

// -- Uploaded Videos (NEW from Search Results) --

export interface AMUploadedVideoAttributes {
  postUrl?: string; // URL to Apple Music Post (Connect feature)
  uploadDate?: string; // ISO 8601?
  durationInMilliseconds: number; // Note: different naming convention
  name: string;
  assetTokens?: Record<string, string>; // Dictionary of resolution/format -> tokenized URL
  contentRatingsBySystem?: Record<string, unknown>; // Seems to be an object, structure unknown
  artistName: string; // Uploader name?
  artwork: AMArtwork;
  playParams: AMPlayParams;
}

export interface AMUploadedVideoReference extends AMResourceReference {
    type: 'uploaded-videos';
}

export interface AMUploadedVideo {
  id: string;
  type: 'uploaded-videos';
  href: string;
  attributes: AMUploadedVideoAttributes;
  // No relationships seen in sample
}


// --- Main Response Structures ---

/**
 * Container for included resource objects, keyed by type, then ID.
 * Extended for search results.
 */
export interface AMResourcesContainer {
  'library-playlists'?: { [id: string]: AMLibraryPlaylist };
  'playlists'?: { [id: string]: AMCatalogPlaylist };
  'library-songs'?: { [id: string]: AMLibrarySong };
  'songs'?: { [id: string]: AMCatalogSong };
  'apple-curators'?: { [id: string]: AMAppleCurator };
  'artists'?: { [id: string]: AMArtist };
  // New types from search
  'albums'?: { [id: string]: AMAlbum };
  'music-videos'?: { [id: string]: AMMusicVideo };
  'stations'?: { [id: string]: AMStation };
  'uploaded-videos'?: { [id: string]: AMUploadedVideo };
  // Add other potential types here as needed
}

/**
 * Specific type for the Reference in the top-level data array of the single playlist response.
 */
export interface AMLibraryPlaylistReference extends AMResourceReference {
    type: 'library-playlists';
}

/**
 * The top-level structure of the Apple Music API response for a SINGLE playlist fetch.
 */
export interface AMPlaylistResponse {
  data: AMLibraryPlaylistReference[]; // Primary resource reference
  resources?: AMResourcesContainer; // Included related resources (optional)
}

// --- Search Response Specific Types (NEW) ---

/**
 * Represents a group of search results for a specific type (e.g., artists, albums).
 */
export interface AMSearchResultGroup<T extends AMResourceReference> {
    href?: string; // Link to refine search for this type
    next?: string; // Link to next page of results for this type
    data: T[]; // Array of references for this type
    name: string; // Display name (e.g., "Artists")
    groupId: string; // Internal group ID (e.g., "artist")
}

/**
 * Represents a union of possible resource references found in the 'top' search results.
 */
export type AMSearchTopResultItemReference =
    | AMCatalogSongReference
    | AMArtistReference
    | AMAlbumReference
    | AMMusicVideoReference
    | AMCatalogPlaylistReference
    | AMStationReference // Add others as needed
    | AMAppleCuratorReference;

/**
 * Represents the 'top' results group which contains mixed types.
 */
export interface AMTopSearchResultGroup {
    // No href/next at this level
    data: AMSearchTopResultItemReference[];
    name: string; // e.g., "Top Results"
    groupId: 'top';
}

/**
 * Represents the 'results' part of the search response, containing different groups.
 * Keys are typically the `groupId` values.
 */
export interface AMSearchResults {
    top?: AMTopSearchResultGroup;
    artist?: AMSearchResultGroup<AMArtistReference>;
    album?: AMSearchResultGroup<AMAlbumReference>;
    song?: AMSearchResultGroup<AMCatalogSongReference>;
    playlist?: AMSearchResultGroup<AMCatalogPlaylistReference>;
    'radio_episode'?: AMSearchResultGroup<AMStationReference>; // Note: uses station type reference
    station?: AMSearchResultGroup<AMStationReference>;
    'music_video'?: AMSearchResultGroup<AMMusicVideoReference>;
    'video_extra'?: AMSearchResultGroup<AMUploadedVideoReference>; // Note: uses uploaded-video type reference
    // Add other potential groups like 'curator', 'record-label', 'activity' if needed
    [key: string]: AMTopSearchResultGroup | AMSearchResultGroup<any> | undefined; // Index signature for flexibility
}

/**
 * Represents the 'meta' part of the search response.
 */
export interface AMSearchMeta {
    results: {
        order: string[]; // Array of groupIds in display order
        rawOrder: string[]; // Array of groupIds potentially including types with no results
    };
    metrics?: { // Optional metrics data
        dataSetId: string;
    };
}

/**
 * The top-level structure of the Apple Music API search response.
 */
export interface AMSearchResponse {
    results: AMSearchResults;
    resources?: AMResourcesContainer; // Included full resources (optional based on request/results)
    meta?: AMSearchMeta; // Optional meta information
}


// --- END OF types.ts ---
