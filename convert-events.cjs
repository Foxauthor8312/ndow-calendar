const fs = require('fs');

const raw = fs.readFileSync(
  'all-events.txt',
  'utf8'
);

const blocks = raw.split(
  '===================='
);

const events = [];

blocks.forEach(block => {

  const lines = block
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  if(lines.length < 3) return;

 const title =
  lines.find(line =>

    !line.includes('Date') &&
    !line.includes('URL:') &&
    !line.includes('NV') &&
    line.length > 5

  ) || '';

  let location = '';
  let dateLine = '';

  lines.forEach((line, index) => {

    if(
      line.includes('NV')
    ){
      location = line;
    }
if(
  line.toLowerCase().includes('date')
){
  dateLine =
    lines[index + 1] || '';
}

  });

 if(!dateLine){

  console.log(
    'SKIPPED - NO DATE:',
    lines
  );

  return;

}

  const cleanDate =
    dateLine
      .replace('PST', '')
      .replace('PDT', '')
      .replace('MDT', '')
      .trim();

  const parsedDate =
    new Date(cleanDate);

 if(
  parsedDate < new Date('2026-01-01')
){

  console.log(
    'SKIPPED - OLD/INVALID DATE:',
    cleanDate,
    title
  );

  return;

}

  let category = 'Other';

  if(
  title.includes('Hunter')
  ||
  title.includes('Advanced')
){
  category = 'Hunter Education';
}

  if(title.includes('Fishing')){
    category = 'Fishing';
  }

  if(
    title.includes('Wildlife') ||
    title.includes('WILD')
  ){
    category = 'Wildlife';
  }

  if(title.includes('Archery')){
    category = 'Archery';
  }

  if(title.includes('Bowhunter')){
    category = 'Bowhunter';
  }

  if(title.includes('Boating')){
    category = 'Boating';
  }

  if(title.includes('Schools')){
    category = 'Schools';
  }

const urlLine = lines.find(
  line => line.startsWith('URL:')
);

const url =
  urlLine
    ? urlLine.replace('URL:', '').trim()
    : '';

 events.push({

  title,

  category,

  date:
    cleanDate.split(' ')[0] + ' ' +
    cleanDate.split(' ')[1] + ' ' +
    cleanDate.split(' ')[2],

  time:
    cleanDate.replace(
      /^.*?\d{4}/,
      ''
    ).trim(),

  location,

  description:
    title + ' - ' + location,

  url

});

});

fs.writeFileSync(
  './events.json',
  JSON.stringify(
    {
      lastUpdated:
        new Date().toISOString(),
      events
    },
    null,
    2
  )
);

console.log(
  'Created events.json with',
  events.length,
  'events'
);
