import { Autocomplete } from '@mantine/core';
import { Container } from '@mantine/core';

export default function Demo() {
  return (
    <Container size="xs">
        <Autocomplete
        label="Your favorite library"
        placeholder="Pick value or enter anything"
        data={['React', 'Angular', 'Vue', 'Svelte']}
        />
    </Container>
  );
}