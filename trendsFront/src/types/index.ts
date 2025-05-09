type Photo = {
  url: string
}

type Media = {
  type: string
  path: string,
  description: string
}

export type User = {
  id: string
  name: string
  photo: Photo
}

export type Comment = {
  id: string
  description: string
  user: User
  created_at: string
}

type Likes = {
  user: User,
  createdAt: string
}

export type POST = {
  id: string
  userId: User
  comment: string
  comments: Comment[]
  likes: Likes[]
  media: Media[]
  createdAt: string
  placeId: Place
}

type CategoryTrend = {
  id: number;
  name: string;
  _id: string
}

type locationTrend = {
  address: string;
  country: string;
  cross_street: string;
  locality: string;
  region: string;
  _id: string
}

type photoTrend = {
  url: string;
  _id: string
}

export type Tip = {
  created_at: string,
  text: string
}

export type Trend = {
  _id: string;
  fsq_id: string;
  categories: CategoryTrend[];
  coordinates: number[]
  createdAt: string;
  name: string;
  location: locationTrend;
  photos: photoTrend[];
  popularity: number;
  rating: number;
  tip: Tip[]
}

export type Review = {
  id: string,
  user: User,
  comment: string,
  rating: number,
}

export type Category = {
  id: string,
  name: string,
  label: string
}

export type Place = Omit<Trend, 'fsq_id' | 'tip' | 'categories'> & {
  review: Review[],
  categories: Category[]
}