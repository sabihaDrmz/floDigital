import {BASE_URL} from '../Settings';

const fileExt = [
  'pdf',
  'xls',
  'xlsx',
  'doc',
  'docx',
  'odt',
  'tex',
  'pptx',
  'ppt',
  'rtf',
  'txt',
  'string',
];
const imageExt = ['jpg', 'jpeg', 'bmp', 'gif', 'png'];

function getFileIcon(ext: string, uri?: string) {
  // Bilinen dosya ikonumu ?
  switch (ext) {
    case 'xls':
    case 'xlsx':
      return require('../../assets/img/ui/FileIcon/excel.png');
    case 'pdf':
      return require('../../assets/img/ui/FileIcon/pdf.png');
    case 'doc':
    case 'tex':
    case 'odt':
    case 'docx':
      return require('../../assets/img/ui/FileIcon/word.png');
  }

  // Fotoğraf ise ve url geldiyse fotoğrafı dön
  if (imageExt.includes(ext) && uri) return {uri: BASE_URL + uri.substring(1)};

  // Varsayılan dosya ikonu
  return require('../../assets/img/ui/FileIcon/file.png');
}

export {fileExt, imageExt, getFileIcon};
