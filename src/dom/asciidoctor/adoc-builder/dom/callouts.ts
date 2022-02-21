export interface Callout {
  $$smap: { ordinal: number, id: string };
}

export interface Callouts {
  $callout_ids(li_ordinal: number): string[];

  $current_list(): Callout[];

  $next_list(): Callout[];
}
