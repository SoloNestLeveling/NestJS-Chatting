import { PickType } from "@nestjs/mapped-types";
import { ImagesModel } from "../entity/images.entity";

export class CreateImageDto extends PickType(ImagesModel, [
    'order',
    'path',
    'type',
    'message'
]) { }