"use client";

import { useState } from "react";
import { useForm } from "@mantine/form";
import {
  Container,
  TextInput,
  Textarea,
  Select,
  Radio,
  NumberInput,
  Button,
  Group,
  Title,
  Card,
} from "@mantine/core";

export default function RentingForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      propertyType: "",
      transactionType: "renting",
      location: "",
      cameras: 1,
      surface: 0,
      title: "",
      description: "",
    },

    validate: {
      propertyType: (value) => (value ? null : "Property type is required"),
      transactionType: (value) => (value ? null : "Transaction type is required"),
      location: (value) => (value ? null : "Location is required"),
      cameras: (value) => (value > 0 ? null : "Number of cameras must be greater than 0"),
      surface: (value) => (value > 0 ? null : "Surface must be greater than 0"),
      title: (value) => (value.trim().length > 0 ? null : "Title is required"),
      description: (value) =>
        value.trim().length >= 10 ? null : "Description must be at least 10 characters long",
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    setLoading(true);

    // Simulate form submission delay
    setTimeout(() => {
      console.log("Submitted data:", values);

      // Reset the form
      form.reset();
      setLoading(false);
    }, 2000); // Simulated 2-second delay
  };

  return (
    <Container size="sm">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group align="center" justify="center">
        <Title order={2} mb="lg">
          Renting Registration Form
        </Title>
        </Group>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          {/* Property Type Dropdown */}
          <Select
            label="Property Type"
            placeholder="Select property type"
            mb="sm"
            data={["Apartment", "House", "Field", "Commercial"]}
            {...form.getInputProps("propertyType")}
            required
          />

          {/* Transaction Type Radio */}
          <Radio.Group
            label="Transaction Type"
            mb="sm"
            required
            {...form.getInputProps("transactionType")}
          >
            <Radio value="buying" label="Buying" mb="xs"/>
            <Radio value="renting" label="Renting" mb="xs"/>
          </Radio.Group>

          {/* Location Address */}
          <TextInput
            label="Location Address"
            placeholder="Enter location address"
            mb="sm"
            required
            {...form.getInputProps("location")}
          />

          {/* Number of Cameras */}
          <NumberInput
            label="Number of Cameras"
            placeholder="Enter number of cameras"
            mb="sm"
            required
            min={1}
            {...form.getInputProps("cameras")}
          />

          {/* Surface Area */}
          <NumberInput
            label="Surface Area (sqm)"
            placeholder="Enter surface area"
            mb="sm"
            required
            min={1}
            {...form.getInputProps("surface")}
          />

          {/* Title */}
          <TextInput
            label="Title"
            placeholder="Enter a title for your listing"
            mb="sm"
            required
            {...form.getInputProps("title")}
          />

          {/* Short Description */}
          <Textarea
            label="Short Description"
            placeholder="Enter a brief description"
            mb="sm"
            required
            {...form.getInputProps("description")}
            minRows={3}
          />

          {/* Submit Button */}
          <Group align="center" justify="center" mt="md">
            <Button type="submit" loading={loading}>
              Submit
            </Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
}
