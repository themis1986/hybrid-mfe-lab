<script setup lang="ts">
import {
  TButton,
  TCluster,
  TDialog,
  TDialogBody,
  TDialogClose,
  TDialogContent,
  TDialogDescription,
  TDialogFooter,
  TDialogHeader,
  TDialogTitle,
  TDialogTrigger,
  TField,
  TStack,
} from '@repo/ui-vue'
import { ref } from 'vue'
import DemoBlock from '../components/DemoBlock.vue'

const open = ref(false)
const name = ref('Ada Lovelace')
const email = ref('ada@example.com')
</script>

<template>
  <TCluster>
    <TDialog v-model:open="open">
      <TDialogTrigger as-child>
        <TButton label="Edit profile" />
      </TDialogTrigger>
      <TDialogContent>
        <TDialogHeader>
          <TDialogTitle>Edit profile</TDialogTitle>
          <TDialogDescription
            >v-model:open: Save closes it by setting open to
            false.</TDialogDescription
          >
        </TDialogHeader>
        <TDialogBody>
          <TStack :gap="3">
            <TField v-model="name" label="Name" />
            <TField v-model="email" label="Email" type="email" />
          </TStack>
        </TDialogBody>
        <TDialogFooter>
          <TDialogClose as-child>
            <TButton variant="ghost" label="Cancel" />
          </TDialogClose>
          <TButton label="Save" @click="open = false" />
        </TDialogFooter>
      </TDialogContent>
    </TDialog>
    <TDialog>
      <TDialogTrigger as-child>
        <TButton variant="outline" label="Delete…" />
      </TDialogTrigger>
      <TDialogContent size="sm">
        <TDialogHeader>
          <TDialogTitle>Delete this item?</TDialogTitle>
          <TDialogDescription
            >Small and uncontrolled. This can't be undone.</TDialogDescription
          >
        </TDialogHeader>
        <TDialogFooter>
          <TDialogClose as-child>
            <TButton variant="ghost" label="Cancel" />
          </TDialogClose>
          <TDialogClose as-child>
            <TButton variant="danger" label="Delete" />
          </TDialogClose>
        </TDialogFooter>
      </TDialogContent>
    </TDialog>
    <TDialog>
      <TDialogTrigger as-child>
        <TButton variant="soft" label="Full screen" />
      </TDialogTrigger>
      <TDialogContent size="full">
        <TDialogHeader>
          <TDialogTitle>Full screen</TDialogTitle>
          <TDialogDescription
            >size="full" fills the viewport; the body takes the free height and
            scrolls.</TDialogDescription
          >
        </TDialogHeader>
        <TDialogBody>
          <TStack :gap="2">
            <DemoBlock v-for="i in 40" :key="i">Row {{ i }}</DemoBlock>
          </TStack>
        </TDialogBody>
        <TDialogFooter>
          <TDialogClose as-child>
            <TButton label="Done" />
          </TDialogClose>
        </TDialogFooter>
      </TDialogContent>
    </TDialog>
  </TCluster>
</template>
