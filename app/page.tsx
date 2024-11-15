import {Stack, Button, Flex, Title, Container} from '@mantine/core'
import Link from "next/link";

export default function HomePage() {
  return (

      <Stack align="center" justify="center" gap="md" margins="md">

          <Title order={1}> Welcome to HomeHunters! </Title>


          <Title order={2}> Have an account? </Title>


          <Link href="/signin" passHref>
              <Button
                variant="filled"
                color="gray"
                radius="md"

                align="center"
              >
                Sign In
              </Button>
          </Link>




          <Title order={2}> Don't have an account? </Title>


            <Button
                variant="filled"
                color="gray"
                radius="md"
                component="a"
                href="/signup"
            >
                Sign Up
            </Button>



          <Title order={2}> Details </Title>

              <Button
                  variant="filled"
                  color="gray"
                  radius="md"
                  component="a"
                  href="/another-page"
              >
                  Go to another page
              </Button>


              <Button
                  variant="filled"
                  color="gray"
                  radius="md"
                  component="a"
                  href="/portfolio-page"
              >
                  Go to Portfolio
              </Button>

      </Stack>

  );
}
