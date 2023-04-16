//import * as bcrypt from 'bcryptjs';
import * as argon from 'argon2';

export class PasswordService {
  // static hashPassword(password: string): string {
  //   return bcrypt.hashSync(password, 10);
  // }

  // static compare(password: string, hash: string): Promise<boolean> {
  //   return new Promise((resolve, reject) => {
  //     bcrypt.compare(password, hash, (err, result) => {
  //       if (result) resolve(true);
  //       else resolve(false);
  //     });
  //   });
  // }
  // Argon
  static hashPasswordArgon(password: string): Promise<string> {
    if (password) return argon.hash(password);
  }

  static compareArgon(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      argon.verify(hash, password).then((result) => {
        if (result) resolve(true);
        else resolve(false);
      });
    });
  }
}
