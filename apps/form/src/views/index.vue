<script setup lang="ts">
import DarkButton from '@/components/common/DarkButton.vue'
import Logo from '@/components/common/Logo.vue'
import UserButton from '@/components/common/UserButton.vue'
import TooltipComponents from '@/components/form/TooltipComponents.vue'
import RouteButton from '@/components/home/RouteButton.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useUser } from '@/stores/user'
import { ChartBarIcon, HomeIcon, Menu, MenuIcon, Search, ShoppingCartIcon } from 'lucide-vue-next'
// @ts-ignore
import { Icon } from '@iconify/vue'
import { KeepAlive, ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
const { user } = useUser()
const activePath = ref('/' + route.path.split('/')[1])
watch(
  () => route.path,
  (newVal) => {
    activePath.value = '/' + newVal.split('/')[1]
  },
)
</script>

<template>
  <div
    class="grid transition-all min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
  >
    <div class="hidden border-r bg-muted/40 md:block">
      <div class="flex h-full max-h-screen flex-col gap-2">
        <Logo />
        <div class="flex-1">
          <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
            <RouteButton title="仪表板" path="/board" :active="activePath === '/board'">
              <template #icon>
                <HomeIcon class="h-4 w-4" />
              </template>
            </RouteButton>
            <RouteButton title="表单管理" path="/form" :active="activePath === '/form'">
              <template #icon>
                <MenuIcon class="h-4 w-4" />
              </template>
            </RouteButton>
            <RouteButton title="创建表单" path="/create" :active="activePath === '/create'">
              <template #icon>
                <Icon icon="material-symbols:create-new-folder-outline" class="h-4 w-4" />
              </template>
            </RouteButton>
            <RouteButton title="预览" path="/preview" :active="activePath === '/preview'">
              <template #icon>
                <ChartBarIcon class="h-4 w-4" />
              </template>
            </RouteButton>
          </nav>
        </div>
        <div class="mt-auto p-4">
          <Card>
            <CardContent class="p-2 flex justify-around items-center">
              <UserButton />
              <div class="flex flex-col gap-2 text-sm text-muted-foreground">
                <TooltipComponents :title="user?.user.user_metadata.name ?? ''">
                  <p
                    class="text-[0.75rem] text-left max-w-[100px] lg:max-w-[160px] text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis"
                  >
                    用户名：{{ user?.user.user_metadata.name }}
                  </p>
                </TooltipComponents>
                <TooltipComponents :title="user?.user.user_metadata.email ?? ''">
                  <p
                    class="text-[0.75rem] max-w-[100px] lg:max-w-[160px] text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis"
                  >
                    邮箱：{{ user?.user.user_metadata.email }}
                  </p>
                </TooltipComponents>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <header class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <Sheet>
          <SheetTrigger as-child>
            <Button variant="outline" size="icon" class="shrink-0 md:hidden">
              <Menu class="h-5 w-5" />
              <span class="sr-only">切换导航菜单</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" class="flex flex-col">
            <nav class="grid gap-2 text-lg font-medium">
              <RouteButton title="仪表板" path="/board" :active="activePath === '/board'">
                <template #icon>
                  <HomeIcon class="h-4 w-4" />
                </template>
              </RouteButton>
              <RouteButton title="表单" path="/form" :active="activePath === '/form'">
                <template #icon>
                  <ShoppingCartIcon class="h-4 w-4" />
                </template>
              </RouteButton>
              <RouteButton title="创建表单" path="/create" :active="activePath === '/create'">
                <template #icon>
                  <Icon icon="material-symbols:create-new-folder-outline" class="h-4 w-4" />
                </template>
              </RouteButton>
              <RouteButton title="预览" path="/preview" :active="activePath === '/preview'">
                <template #icon>
                  <ChartBarIcon class="h-4 w-4" />
                </template>
              </RouteButton>
            </nav>
            <div class="mt-auto">
              <Card>
                <CardContent class="p-2 flex justify-around items-center">
                  <UserButton />
                  <div class="flex flex-col gap-2 text-sm text-muted-foreground">
                    <TooltipComponents :title="user?.user.user_metadata.name ?? ''">
                      <p
                        class="text-[0.75rem] text-left max-w-[100px] lg:max-w-[160px] text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis"
                      >
                        用户名：{{ user?.user.user_metadata.name }}
                      </p>
                    </TooltipComponents>
                    <TooltipComponents :title="user?.user.user_metadata.email ?? ''">
                      <p
                        class="text-[0.75rem] max-w-[100px] lg:max-w-[160px] text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis"
                      >
                        邮箱：{{ user?.user.user_metadata.email }}
                      </p>
                    </TooltipComponents>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SheetContent>
        </Sheet>
        <div class="w-full flex-1">
          <form>
            <div class="relative">
              <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索..."
                class="w-full appearance-none bg-background pl-8 shadow-none transition-all md:w-2/3 lg:w-1/3 focus:w-full hover:w-full active:w-full"
              />
            </div>
          </form>
        </div>
        <div class="flex gap-2">
          <DarkButton />
          <UserButton />
        </div>
      </header>
      <main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <KeepAlive>
          <RouterView />
        </KeepAlive>
      </main>
    </div>
  </div>
</template>
