import { generate } from 'random-words';

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const statusOptions = [
  'labot',
  'in_progress',
  'unsupported',
  // 'supported',
  // 'in_voting',
  // 'voiting_ended',
  // 'realized',
  // 'submitted',
  // 'does_not_quality',
  // 'ready_to_vote',
];
const ideasStatus = ['submitted', 'answered', 'realized'];

const createProject = (status: string[], num: number) => {
  const arr: any = [];
  for (let i = 1; i <= num; i++) {
    const pictures = [];
    let name;
    if (i === 1) {
      // First project has only one image
      pictures.push(`https://picsum.photos/id/${randomNumber(5, 99)}/300/300`);
      name = generate({ exactly: 2, join: ' ' });
    } else {
      for (let j = 0; j < 3; j++) {
        pictures.push(`https://picsum.photos/id/${randomNumber(5, 99)}/300/300`);
      }
      name = generate({ exactly: 10, join: ' ' });
    }
    const obj = {
      id: i,
      pictures,
      name,
      status: status[randomNumber(0, statusOptions.length - 1)],
      voted: i % 4 === 0 ? true : false,
    };
    arr.push(obj as never);
  }
  return arr;
};

export const projectData = createProject(statusOptions, 12);
export const ideasData = createProject(ideasStatus, 24);
