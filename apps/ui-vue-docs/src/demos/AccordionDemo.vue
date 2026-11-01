<script setup lang="ts">
import {
  TAccordion,
  TAccordionContent,
  TAccordionItem,
  TAccordionTrigger,
  TGrid,
} from '@repo/ui-vue'

const faqs = [
  {
    value: 'shipping',
    question: 'How long does shipping take?',
    answer: 'Orders ship within two working days.',
  },
  {
    value: 'returns',
    question: 'Can I return an item?',
    answer: 'Yes, within 30 days, unused and in its box.',
  },
  {
    value: 'support',
    question: 'How do I reach support?',
    answer: 'Write to us any time; we answer within a day.',
  },
]
</script>

<template>
  <TGrid min-child-width="18rem" :gap="8">
    <TAccordion
      type="single"
      collapsible
      default-value="shipping"
      aria-label="Single"
    >
      <TAccordionItem v-for="faq in faqs" :key="faq.value" :value="faq.value">
        <TAccordionTrigger>{{ faq.question }}</TAccordionTrigger>
        <TAccordionContent>{{ faq.answer }}</TAccordionContent>
      </TAccordionItem>
    </TAccordion>
    <TAccordion
      type="multiple"
      :default-value="['returns', 'support']"
      aria-label="Multiple"
    >
      <TAccordionItem v-for="faq in faqs" :key="faq.value" :value="faq.value">
        <TAccordionTrigger>{{ faq.question }}</TAccordionTrigger>
        <TAccordionContent>{{ faq.answer }}</TAccordionContent>
      </TAccordionItem>
    </TAccordion>
  </TGrid>
</template>
