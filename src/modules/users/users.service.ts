import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './application/dto/create-user.dto';
import { UpdateUserDto } from './application/dto/update-user.dto';

import { S3, Rekognition } from 'aws-sdk';
import { UserApplication } from './application/user.application';
import { UserFactory } from './domain/models/user.factory';
import { Trace } from 'src/helpers/trace.helper';
import { ResponseDto } from '../shared/application/interfaces/dtos/response.dto';

@Injectable()
export class UsersService {
  constructor(private Application: UserApplication) {}
  async create(createUserDto: CreateUserDto, files: Express.Multer.File) {
    try {
      if (files != null) {
        const s3 = new S3();
        const imageS3 = await s3
          .upload({
            Bucket: process.env.AWS_BUCKET,
            Key: files[0].originalname,
            Body: files[0].buffer,
          })
          .promise();
        const user = new UserFactory().create(createUserDto);
        (await user).imageURL = imageS3.Location;
        (await user).imageName = imageS3.Key;
        return await this.Application.add(await user);
      } else {
        throw new ForbiddenException('Es obliaorio subir una imagen');
      }
    } catch (error) {
      if (
        error.message.includes('duplicate key value violates unique constraint')
      ) {
        throw new ForbiddenException('El número de documento ya existe');
      } else {
        throw new ForbiddenException(error.message);
      }
    }
  }
  async compareFace(user: any, files: Express.Multer.File) {
    try {
      // buscar usuario
      if (files === null) {
        throw new ForbiddenException('Es obliaorio subir una imagen');
      }
      const userId = +user.userId;
      const userBY = (await this.Application.findByOne({ id: userId }, []))
        .payload.data as any;
      if (userBY) {
        // COMPARA IMAGE
        let Bucket = process.env.AWS_BUCKET;
        let Key = userBY.imageName;
        let requestBUCKET = {
          Bucket,
          Key,
        };
        let s3bucket = new S3();
        let fotografia = await s3bucket.getObject(requestBUCKET).promise();
        const bufferFoto = await Buffer.from(
          fotografia.Body.toString('base64').replace(
            /^data:image\/\w+;base64,/,
            '',
          ),
          'base64',
        );

        //VALIDACION FACIAL
        const params_ = {
          SimilarityThreshold: 90,
          SourceImage: { Bytes: bufferFoto },
          TargetImage: { Bytes: files[0].buffer },
        };
        var rekognition = new Rekognition();
        let compareFacesResponse = await rekognition
          .compareFaces(params_)
          .promise();
        let resultado =
          'Similitud : ' + compareFacesResponse.FaceMatches[0].Similarity;

        return ResponseDto<any>(
          Trace.TraceId(),
          compareFacesResponse.FaceMatches[0],
        );
      }
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
