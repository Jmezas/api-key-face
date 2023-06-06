import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './application/dto/create-user.dto';
import { UpdateUserDto } from './application/dto/update-user.dto';

import { S3, Rekognition } from 'aws-sdk';
import { UserApplication } from './application/user.application';
import { UserFactory } from './domain/models/user.factory';
import { Trace } from 'src/helpers/trace.helper';
import { ResponseDto } from '../shared/application/interfaces/dtos/response.dto';
import { PasswordDTO } from './application/dto/password-user-dto';
import { AuthApplication } from '../auth/application/auth.application';
import { ResultCompare } from './application/dto/resultCompare';

@Injectable()
export class UsersService {
  constructor(
    private Application: UserApplication,
    private applicationAuth: AuthApplication,
  ) {}
  async create(createUserDto: CreateUserDto, files: Express.Multer.File) {
    try {
      if (files != null) {
        //imagen a comparar
        const params = {
          Image: {
            Bytes: files[0].buffer,
          },
          Attributes: ['ALL'],
        };
        //instancia de rekognition
        var rekognition = new Rekognition();

        //detecta rostros
        let detectFace = await rekognition
          .detectFaces(params)
          .promise()
          .catch((err) => {
            throw new ForbiddenException(err.message);
          });
        if (detectFace.FaceDetails.length === 0) {
          throw new ForbiddenException('No se detecto rostro en la imagen');
        }

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
        const response = (await this.Application.add(await user)).payload
          .data as any;
        if (response) {
          const email = (await user).email;
          const password = createUserDto.password;
          console.log(email, password);
          const result = await this.applicationAuth.login({ email, password });
          return result;
        } else {
          throw new ForbiddenException('Error al crear usuario');
        }
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
      //inicializar variables
      let resultCompare = new ResultCompare();
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

        //imagen a comparar
        const params = {
          Image: {
            Bytes: files[0].buffer,
          },
          Attributes: ['ALL'],
        };
        //instancia de rekognition
        var rekognition = new Rekognition();

        //detecta rostros
        let detectFace = await rekognition
          .detectFaces(params)
          .promise()
          .then((data) => {
            console.log('data', data);
            return data;
          })
          .catch((err) => {
            console.log(err);
            throw new ForbiddenException(err.message);
          });
        if (detectFace.FaceDetails.length != 0) {
          for (
            let index = 0;
            index < detectFace.FaceDetails[0].Emotions.length;
            index++
          ) {
            const element = detectFace.FaceDetails[0].Emotions[index];
            if (
              element.Type == 'FEAR' ||
              element.Type == 'SAD' ||
              element.Type == 'DISGUSTED'
            ) {
              if (element.Confidence > 90) {
                throw new ForbiddenException(
                  'No se puede detectar la foto por que tiene emociones negativas',
                );
              }
            }
            resultCompare.Emotions.push({
              Type: element.Type,
              Confidence: element.Confidence,
            });
          }

          //PARAMETROS DE COMPARACION
          const params_ = {
            SimilarityThreshold: 90,
            SourceImage: { Bytes: bufferFoto },
            TargetImage: { Bytes: files[0].buffer },
          };

          //VALIDACION FACIAL
          let compareFacesResponse = await rekognition
            .compareFaces(params_)
            .promise()
            .catch((err) => {
              console.log(err);
              throw new ForbiddenException(err.message);
            });

          if (
            compareFacesResponse.FaceMatches.length == 0 ||
            compareFacesResponse == undefined
          ) {
            throw new ForbiddenException(
              'No se puede comprar la foto por que no se parece a la foto del usuario',
            );
          }
          resultCompare.Similarity =
            compareFacesResponse.FaceMatches[0].Similarity;
        }

        return ResponseDto<any>(
          Trace.TraceId(),
          resultCompare,
          //detectFace,
        );
      }
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async findAll() {
    Trace.TraceId(true);
    const result = await this.Application.findAll({}, ['roles'], {});
    return result;
  }

  async findOne(id: number) {
    Trace.TraceId(true);
    const result = await this.Application.findByOne({ id }, ['roles']);
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto, user: any) {
    Trace.TraceId(true);
    const productToInsert = { id: id, ...updateUserDto };
    const product = new UserFactory().create(productToInsert);
    (await product).updatedUser = +user.userId;
    (await product).updatedAt = new Date();
    const result = await this.Application.update(await product, {}, []);
    return result;
  }

  async remove(id: number, user: any) {
    Trace.TraceId(true);
    const result = await this.Application.delete({ id }, +user.userId);
    return result;
  }

  async fullpage(query: any) {
    if (!query.search) {
      delete query.search;
    }
    Trace.TraceId(true);
    const result = await this.Application.getPage(
      query.page,
      query.limit,
      { name: query.search, status: true },
      ['roles', 'warehouses'],
      { id: 'desc' },
    );
    return result;
  }

  async upatePassword(PasswordDTO: PasswordDTO) {
    Trace.TraceId(true);
    const result = await this.Application.updatePassword(PasswordDTO);
    return result;
  }
}
