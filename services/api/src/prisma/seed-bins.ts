import { db } from './db.js';

const bins = [
  { code: 'B1', row: 1, column: 1, markerType: 'ARUCO', markerValue: '1' },
  { code: 'B2', row: 1, column: 2, markerType: 'ARUCO', markerValue: '2' },
  { code: 'B3', row: 1, column: 3, markerType: 'ARUCO', markerValue: '3' },
  { code: 'B4', row: 1, column: 4, markerType: 'ARUCO', markerValue: '4' },

  { code: 'B5', row: 2, column: 1, markerType: 'ARUCO', markerValue: '5' },
  { code: 'B6', row: 2, column: 2, markerType: 'ARUCO', markerValue: '6' },
  { code: 'B7', row: 2, column: 3, markerType: 'ARUCO', markerValue: '7' },
  { code: 'B8', row: 2, column: 4, markerType: 'ARUCO', markerValue: '8' },

  { code: 'B9', row: 3, column: 1, markerType: 'ARUCO', markerValue: '9' },
  { code: 'B10', row: 3, column: 2, markerType: 'ARUCO', markerValue: '10' },
  { code: 'B11', row: 3, column: 3, markerType: 'ARUCO', markerValue: '11' },
  { code: 'B12', row: 3, column: 4, markerType: 'ARUCO', markerValue: '12' },

  { code: 'B13', row: 4, column: 1, markerType: 'ARUCO', markerValue: '13' },
  { code: 'B14', row: 4, column: 2, markerType: 'ARUCO', markerValue: '14' },
  { code: 'B15', row: 4, column: 3, markerType: 'ARUCO', markerValue: '15' },
  { code: 'B16', row: 4, column: 4, markerType: 'ARUCO', markerValue: '16' },
] as const;

async function seed() {
  for (const bin of bins) {
    await db.orm.public.Bin.upsert({
      create: {
        ...bin,
        quantity: 0,
        reservedQuantity: 0,
      },
      update: {
        row: bin.row,
        column: bin.column,
        markerType: bin.markerType,
        markerValue: bin.markerValue,
      },
      conflictOn: {
        code: bin.code,
      },
    });
  }

  const allBins = await db.orm.public.Bin.all();

  console.log(allBins);

  await db.close();
}

seed().catch(async (error) => {
  console.error(error);
  await db.close();
  process.exit(1);
});