import {testCases} from 'example-library';

export default async function Page() {
  await testCases();
  console.log('success');
  return null;
}
