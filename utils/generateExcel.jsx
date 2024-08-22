import * as ExcelJS from 'exceljs';
import moment from 'moment';
import { useEffect, useState } from 'react';

// promisifyWorkbook = (workbook) => {
//     return new Promise((resolve, reject) => {
//         workbook.xlsx.writeBuffer()
//             .then((buffer) => {
//                 resolve(buffer);
//             })
//             .catch((error) => {
//                 reject(error);
//             });
//     });
// };

//convert number to Char
export function numberToChar(num) {
    var s = '', t;

    while (num > 0) {
      t = (num - 1) % 26;
      s = String.fromCharCode(65 + t) + s;
      num = (num - t)/26 | 0;
    }
    return s || undefined;
}

//generate excel
export function generateExcel(props) {
    
    try {
        const {
            data = [],
            startRow = 3,
            wordwarp,
            excelTitle = null,
            customCells = []
        } = props;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        // Add header row starting from A2
        const headerRow = worksheet.getRow(startRow);

        
        let headerData =  [];
        if (props.headerData === undefined) {
            Object.keys(data[0]).forEach((key, index) => {
                const newFormat = {
                    title: key,
                    align: 'center',
                    wordwarp: true,
                    valign: 'middle',
                    columnWidth: (data.filter(item => item[key].length > key.length).length > 0) ? 'content' : 'title'
                }
                headerData.push(newFormat);
            })
        } else {
            headerData.push(...props.headerData);
        }

        // set cell length
        Object.keys(data[0]).forEach((key, index) => {
            const column = worksheet.getColumn(index + 1);
            const longerTitle = headerData.filter(data => data.columnWidth === 'title').map(data => data.title);
            column.width = (longerTitle.includes(key)) ? key.length + 4 : data[0][key].length + 4;
        })

        // set header align, color & border, & content align
        Object.keys(data[0]).forEach((key, index) => {
            const column = worksheet.getColumn(index + 1);
            headerRow.getCell(index + 1).value = key;
            headerRow.getCell(index + 1).font = { bold: true };
            
            // set header color
            headerRow.getCell(index + 1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'd7d5d5' },
            }
            // set header border
            headerRow.getCell(index + 1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            
            // set content align
            const selectedHeader = headerData.find(data => data.title === key);
            column.alignment = { horizontal: selectedHeader.align, wrapText: (wordwarp === undefined) ? selectedHeader.wordwarp : wordwarp, vertical: selectedHeader.valign };
            
            // set header align
            headerRow.getCell(index + 1).alignment = { horizontal: 'center' };
        });

        // Add data rows
        data.forEach((rowData, rowIndex) => {
            
            // Add data rows starting point
            const dataRow = worksheet.getRow(rowIndex + (startRow + 1));
            Object.values(rowData).forEach((value, colIndex) => {
                dataRow.getCell(colIndex + 1).value = value;

                // set content border
                dataRow.getCell(colIndex + 1).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });

        
        customCells.map(cell => {
            Object.keys(cell).forEach((key, index) => {
                // initialize custom cell
                worksheet.getCell(cell.cell)[key] = cell[key];
            })

            // check if cell need to merge
            if (cell.mergeTo !== undefined) {
                
                // Merge cells and set column widths
                worksheet.mergeCells(`${cell.cell}:${cell.mergeTo}`);
            }
        })

        // Set the workbook views
        workbook.views = [
            {
                state: 'frozen',
                xSplit: 0,
                ySplit: 2, // Set ySplit to 2 to freeze the first two rows
                activeCell: 'A4', // Start from cell A3
            },
        ];

        // Save the workbook
        workbook.xlsx.writeBuffer().then((buffer) => {

            const date = moment().format("DD-MM-YYYY HH:mm:ss")
            const fileName = `${excelTitle} ${date}.xlsx`;
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}