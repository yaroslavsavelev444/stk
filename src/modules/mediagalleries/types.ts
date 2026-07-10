export interface IMediaGalleryItem {
  id: string;
  imageUrl: string;
  alt: string;
}

export interface IMediaGallery {
  key: string;
  title?: string | null;
  description?: string | null;
  items: IMediaGalleryItem[];
}
