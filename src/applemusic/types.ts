// Response structure
export interface AMPlaylistsResponse {
  next: string;
  data: AMLibraryPlaylist[];
  meta: {
    total: number;
  };
}

// Main playlist object
// export interface AMLibraryPlaylist {
//   id: string;
//   type: string;
//   href: string;
//   attributes: AMPlaylistAttributes;
// }

// Playlist attributes
export interface AMPlaylistAttributes {
  hasCollaboration: boolean;
  lastModifiedDate: string;
  canEdit: boolean;
  name: string;
  description?: {
    standard: string;
  };
  isPublic: boolean;
  canDelete: boolean;
  artwork: AMPlaylistArtwork;
  hasCatalog: boolean;
  playParams: AMPlaylistPlayParams;
  dateAdded: string;
}

// Artwork object
export interface AMPlaylistArtwork {
  width: number | null;
  height: number | null;
  url: string;
  hasP3: boolean;
}

// Play parameters
export interface AMPlaylistPlayParams {
  id: string;
  kind: string;
  isLibrary: boolean;
  globalId?: string;
  versionHash?: string;
}

/**
 * Represents a generic reference to an Apple Music resource type string.
 */
export type AMResourceType =
  | 'library-playlists'
  | 'playlists'
  | 'library-songs'
  | 'songs'
  | 'apple-curators'
  | 'artists';

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
 */
export interface AMArtwork {
  width: number | null; // Can be null for some library items initially
  height: number | null; // Can be null for some library items initially
  url: string; // URL template, requires {w}, {h}, {f} replaced
  bgColor?: string; // Optional background color
  textColor1?: string; // Optional text color 1
  textColor2?: string; // Optional text color 2
  textColor3?: string; // Optional text color 3
  textColor4?: string; // Optional text color 4
  hasP3: boolean; // Indicates if P3 color space is available
}

/**
 * Represents playback parameters for an item.
 * This replaces the simpler AMPlaylistPlayParams with a more general version
 * applicable to playlists and songs.
 */
export interface AMPlayParams {
  id: string;
  kind: string; // e.g., 'playlist', 'song'
  isLibrary?: boolean;
  globalId?: string; // Catalog ID corresponding to a library item
  versionHash?: string;
  catalogId?: string; // For library songs, points to the catalog version
  reporting?: boolean; // For library songs
  reportingId?: string; // For library songs
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
 * Represents editorial notes for catalog playlists.
 */
export interface AMEditorialNotes {
  name: string;
  standard: string;
  short: string;
}

// --- Resource Specific Types ---

// -- Playlists --

/**
 * Represents the attributes of a library playlist.
 * This replaces the simpler AMPlaylistAttributes with a more detailed version
 * based on the provided JSON.
 */
export interface AMLibraryPlaylistAttributes {
  hasCollaboration: boolean;
  isCollaborativeHost: boolean; // Added field
  lastModifiedDate: string; // ISO 8601 date string
  canEdit: boolean;
  name: string;
  isPublic: boolean;
  description?: { standard: string }; // Library playlists might only have standard
  canDelete: boolean;
  artwork: AMArtwork; // Uses the detailed AMArtwork type
  hasCatalog: boolean;
  dateAdded: string; // ISO 8601 date string
  playParams: AMPlayParams; // Uses the detailed AMPlayParams type
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
 * This replaces the simpler AMLibraryPlaylist with a more detailed version
 * including relationships, based on the provided JSON.
 */
export interface AMLibraryPlaylist {
  id: string;
  type: 'library-playlists';
  href: string;
  attributes: AMLibraryPlaylistAttributes; // Uses detailed attributes
  relationships: AMLibraryPlaylistRelationships; // Added relationships
}

export interface AMCatalogPlaylistAttributes {
  lastModifiedDate: string; // ISO 8601 date string
  supportsSing: boolean;
  description: AMDescription; // Uses the common AMDescription type
  artwork: AMArtwork;
  url: string; // Apple Music URL for the playlist
  playParams: AMPlayParams;
  hasCollaboration: boolean;
  curatorName: string;
  audioTraits: string[]; // e.g., ["lossless", "atmos"] - empty in example
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

export interface AMCatalogSongAttributes {
  durationInMillis: number;
  artistUrl?: string; // URL to the artist page
  artwork: AMArtwork;
  url: string; // Apple Music URL for the song
  // Catalog songs often have *fewer* attributes directly; more come from relationships/album
  name?: string; // Often included
  artistName?: string; // Often included
  albumName?: string; // Often included
  genreNames?: string[];
  releaseDate?: string; // YYYY-MM-DD format
  trackNumber?: number;
  discNumber?: number;
  hasLyrics?: boolean;
  playParams?: AMPlayParams; // Usually included
}

export interface AMArtistReference extends AMResourceReference {
  type: 'artists';
}

export interface AMCatalogSongRelationships {
  artists: AMRelationship<AMArtistReference>;
  // albums relationship might also exist
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

export interface AMAppleCuratorAttributes {
  kind: string; // e.g., 'Genre'
  name: string;
  artwork: AMArtwork;
  shortName?: string; // Optional short name
  url: string; // Apple Music URL for the curator
}

export interface AMAppleCurator {
  id: string;
  type: 'apple-curators';
  href: string;
  attributes: AMAppleCuratorAttributes;
  // relationships might exist
}

// -- Artists --

export interface AMArtistAttributes {
  genreNames: string[];
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


// --- Main Response Structure ---

/**
 * Container for included resource objects, keyed by type, then ID.
 */
export interface AMResourcesContainer {
  'library-playlists'?: { [id: string]: AMLibraryPlaylist };
  'playlists'?: { [id: string]: AMCatalogPlaylist };
  'library-songs'?: { [id: string]: AMLibrarySong };
  'songs'?: { [id: string]: AMCatalogSong };
  'apple-curators'?: { [id: string]: AMAppleCurator };
  'artists'?: { [id: string]: AMArtist };
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
  resources: AMResourcesContainer; // Included related resources
}

// If the primary fetch was for a catalog playlist, the 'data' type would be different:
// export interface AMCatalogPlaylistResponse {
//   data: AMCatalogPlaylistReference[];
//   resources: AMResourcesContainer;
// }

// You already provided this type for a list of playlists, keeping it here for reference:
// export interface AMPlaylistsResponse {
//   next: string;
//   data: AMLibraryPlaylist[]; // Uses the updated, detailed AMLibraryPlaylist
//   meta: {
//     total: number;
//   };
// }
