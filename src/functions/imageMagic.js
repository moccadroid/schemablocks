import functions from "firebase-functions";
import Cors from "cors";
const cors = Cors({ origin: true });
import { tmpdir } from 'os';
import sharp from 'sharp';
import fs from 'fs-extra';
import admin from 'firebase-admin';
if (!admin.apps.length) {
  admin.initializeApp();
}

export default function imageMagic(config) {
  return functions.runWith({ memory: "512MB" }).https.onRequest(async (req, res) => {

    const baseFolder = config?.mediaLibrary?.storageFolder ?? "mediaLibrary";
    const sizes = config?.mediaLibrary?.imageMagicSizes ?? [200, 400, 800, 1200, 1600, 2000];

    cors(req, res, async () => {
      if (!req.query.id) {
        return res.status(400).send('id missing');
      }

      const bucket = admin.storage().bucket();
      const bucketFolder = baseFolder + '/images/' + req.query.id + '/';

      const files = await bucket.getFiles({prefix: bucketFolder});

      if (files.length === 0 || files[0].length === 0) {
        res.status(400).send('no source file found');
      }

      const fileId = req.query.id;
      const file = files[0][0];
      const filename = file.name.split('/').pop();
      const fileExtension = filename.split('.').pop();
      const webpExtension = 'webp';
      const sourceFilename = fileId + '.source.';
      const workingDir = join(tmpdir(), 'resize');

      if (filename.startsWith(fileId)) {
        res.status(400).send('image already optimized');
      }

      await fs.ensureDir(workingDir);

      if (fileExtension === 'png') {
        await file.download({destination: join(workingDir, sourceFilename + fileExtension)});
      } else {
        await file.download({destination: join(workingDir, filename)});
        await sharp(join(workingDir, filename)).toFile(join(workingDir, sourceFilename + fileExtension));
      }
      await sharp(join(workingDir, sourceFilename + fileExtension)).webp().toFile(join(workingDir, sourceFilename + webpExtension));


      await Promise.all(sizes.map(async (size) => {
        const newFilename = fileId + '.' + size + '.' + fileExtension;
        const newFilenameWebp = fileId + '.' + size + '.' + webpExtension;

        const options = {width: size, withoutEnlargement: true};
        await sharp(join(workingDir, sourceFilename + fileExtension)).resize(options).toFile(join(workingDir, newFilename));
        await sharp(join(workingDir, sourceFilename + webpExtension)).resize(options).toFile(join(workingDir, newFilenameWebp));

        return Promise.all([
          bucket.upload(join(workingDir, newFilename), {
            destination: bucketFolder + newFilename
          }),
          bucket.upload(join(workingDir, newFilenameWebp), {
            destination: bucketFolder + newFilenameWebp
          })
        ]);
      }));

      await fs.remove(workingDir);

      return res.status(200).send("yay");
    });
  });
}
