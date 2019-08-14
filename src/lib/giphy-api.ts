import fetch from 'node-fetch'

export interface PaginatedRequestOptions {
  limit?: number
  offset?: number
  rating?: string
}

export interface GiphyResponse {
  data: Gif[]
  pagination: Pagination
}

export interface Gif {
  type: string
  id: string
  slug: string
  url: string
  bitly_url: string
  embed_url: string
  images: Images
  title: string
}

export interface FixedHeight {
  url: string
  width: string
  height: string
  mp4: string
  webp: string
}

export interface Images {
  fixed_height: FixedHeight
}

export interface Pagination {
  offset: number
  total_count: number
  count: number
}

const API_BASE_URL = 'https://api.giphy.com'
const API_KEY = '5yFUiFNdRnPjpeUhzS2T2LGyw1Fi9ClD'

const generateUrl = (path: string, params: { [key: string]: any }) => {
  const url = new URL(API_BASE_URL + path)
  url.searchParams.append('api_key', API_KEY)
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  return url.toString()
}

export type TrendingOptions = PaginatedRequestOptions

export const trending =
  (options: TrendingOptions = {}): Promise<GiphyResponse> =>
    fetch(generateUrl('/v1/gifs/trending', options))
      .then(res => res.json())
      .then(body => body as GiphyResponse)

export interface SearchOptions extends PaginatedRequestOptions {
  q: string
}

export const search =
  (options: SearchOptions): Promise<GiphyResponse> =>
    fetch(generateUrl('/v1/gifs/search', options))
      .then(res => res.json())
      .then(body => body as GiphyResponse)
