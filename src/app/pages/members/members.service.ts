import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  constructor(private db: AngularFireDatabase) { }

  importMembers(teamId: string, file: File): void {
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const fileContent: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(fileContent, { type: 'binary' });
      const worksheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[1]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers: any[] = jsonData[3]; // Update the row index to 3
      const dataRows: any[] = jsonData.slice(4); // Update the starting row index to 4

      const members: any[] = dataRows.map((row: any[]) => {
        const nameColumnIndex = headers.indexOf('اسم الطالب');
        const studentNumberColumnIndex = headers.indexOf('رقم الطالب');
        const phoneNumberColumnIndex = headers.indexOf('الجوال');

        const name = row[nameColumnIndex];
        const studentNumber = row[studentNumberColumnIndex];
        const phoneNumber = row[phoneNumberColumnIndex];

        const member: any = {
          name: name,
          role: 'طالب', // Set the default role to 'طالب'
          hours: 0,
          teamId: teamId
        };

        if (name !== undefined && studentNumber !== undefined && phoneNumber !== undefined) {
          // Assign the phone and id fields if they exist
          member.phone = phoneNumber;
          member.id = studentNumber;
        }

        return member;
      });

      members.forEach((member: any) => {
        this.db.list('members').push(member);
      });

      console.log('Members imported successfully!');
    };

    reader.readAsBinaryString(file);
  }
}
