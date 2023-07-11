//@ts-check
const path = require("path");
const fs = require("fs");
const pdf = require("html-pdf");
/**
 * Obtener rutas de todos los archivos html que existan en src
 * @returns {string[]}
 */
function getHTMLFilePaths() {
  /**
   * Path del directorio raíz src
   * @type {string}
   */
  const rootPath = path.join(__dirname, "src");

  /**
   * Lista de rutas para archivos html
   * @type {Array<string>}
   */
  let htmlFilePaths = [];

  /**
   * @param {string} directory
   */
  function exploreDirectory(directory) {
    const files = fs.readdirSync(directory);

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      const fileStats = fs.statSync(filePath);

      if (fileStats.isDirectory()) {
        exploreDirectory(filePath); // Explorar directorios de forma recursiva
      } else if (path.extname(file) === ".html") {
        htmlFilePaths.push(filePath); // Agregar archivos .html a la lista
      }
    });
  }

  exploreDirectory(rootPath);

  return htmlFilePaths;
}

function generatePdfs() {
  const htmlFilePaths = getHTMLFilePaths();

  htmlFilePaths.forEach((pathHtml) => {
    /**
     * Archivo Html
     * @type {string}
     */
    const tmplHtml = fs
      .readFileSync(pathHtml, "utf-8")
      .replace("../../assets/fonts", "/assets/fonts")
      .replace(
        "../../assets/img/phone.png",
        `https://solera-qa.s3.amazonaws.com/phoenix/terminals/motorolo_G200-169x311.png`,
      );

    console.log(tmplHtml);
    /**
     * Ruta donde se guardará el pdf generado
     * @type {string}
     */
    const pathPdf = pathHtml.replace("html", "pdf").replace("src", "pdf");

    /**
     * Opciones de creación de pdf
     * @type {import('html-pdf').CreateOptions}
     */
    const optionsPfd = {
      format: "A4",
      base: `file://${path.join(__dirname, "assets")}`,
    };

    pdf.create(tmplHtml, optionsPfd).toFile(pathPdf, function (err, res) {
      if (err) return console.error(err);
      console.log(res);
    });
  });
}

generatePdfs();
