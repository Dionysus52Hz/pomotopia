class StringFormatter {
   removeAccents(string: string): string {
      return string
         .normalize("NFD")
         .replace(/[\u0300-\u036f]/g, "")
         .replace(/đ/g, "d")
         .replace(/Đ/g, "d")
         .toLowerCase()
         .trim();
   }
}

export class Formatter {
   static string = new StringFormatter();
}
