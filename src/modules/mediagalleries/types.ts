import { MediaGallery } from "@/payload-types";

export type IMediaGalleryItem = NonNullable<MediaGallery["items"]>[number];
