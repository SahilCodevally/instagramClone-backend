// import { IsNotEmpty, IsArray } from 'class-validator';
// import { VALIDATION } from '../../constants';

export class CreatePostDto {
  // @IsArray({ message: 'Please upload images in Array!' })
  // @IsNotEmpty({ message: VALIDATION.images })
  readonly images: any[];

  readonly detail: string;
}
