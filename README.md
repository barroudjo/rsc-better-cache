# rsc-better-cache
A more flexible React Server Components cache, to share data and avoid prop drilling.

The big defect of React's `cache` for server components, is that it requires you to call the cached function with the exact same arguments to work as expected.
But in some cases the arguments are only available in some component, and not in another where you want the same data. You can usually work around this by prop-drilling the data, but no one likes prop-drilling when it can be easily avoided.
This library allows you to avoid such prop-drilling.

## Usage

```typescript
// mySharedData.ts
import { createCachedPromiseGetter } from 'rsc-better-cache';

interface MyData {
  someProp: string;
}

export const myDataPromiseGetter = createCachedPromiseGetter<MyData>();
```

```typescript
// MyReactServerComponent.tsx (React Server Component where the data is obtained)
import { myDataPromiseGetter } from './mySharedData';

const MyReactServerComponent = async (params) => {
  const myData = await fetch(`some-url/${params.id}`);
  myDataPromiseGetter().resolve(myData);
  // ...
}
```

```typescript
// MyOtherReactServerComponent.tsx (React Server Component lower (or higher !) in your app tree)
import { myDataPromiseGetter } from './mySharedData';

const MyOtherReactServerComponent = async () => {
  const myData = await myDataPromiseGetter().promise;
  // ...
}
```
