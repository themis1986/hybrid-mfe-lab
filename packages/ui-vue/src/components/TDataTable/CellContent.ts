import type { VNode } from 'vue'

// Runs a caller's slot in a component of its own, so what the slot reads re-renders only this cell.
export function CellContent(props: {
  render: (context: any) => VNode[] | undefined
  context: unknown
}) {
  return props.render(props.context)
}
CellContent.props = ['render', 'context']
