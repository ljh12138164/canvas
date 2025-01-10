<template>
  <div class="min-h-screen bg-background">
    <!-- 导航栏 -->
    <header class="border-b">
      <div class="container flex h-16 items-center justify-between">
        <div class="flex items-center gap-2">
          <!-- <FormInput class="h-6 w-6" /> -->
          <img src="~/assets/image/logo.jpg" alt="logo" class="h-6 w-6" />
          <span class="font-bold">ljh-form</span>
        </div>
        <nav class="flex items-center gap-6">
          <UserButton />
        </nav>
      </div>
    </header>

    <!-- Hero区域 -->
    <section class="container py-24 space-y-8 text-center">
      <div class="space-y-4">
        <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          快速构建专业的表单
        </h1>
        <p class="mx-auto max-w-[700px] text-lg text-muted-foreground">
          拖拽式表单设计器，让表单制作变得简单。无需编码，即可创建美观的表单。
        </p>
      </div>
      <div class="flex justify-center gap-4">
        <Button size="lg" @click="router.push('/workspace/board')"
          >免费试用</Button
        >
      </div>
    </section>

    <!-- 特性区域 -->
    <section id="features" class="container py-24">
      <div class="text-center space-y-4 mb-16">
        <h2 class="text-3xl font-bold">强大的特性</h2>
        <p class="text-muted-foreground">一切你需要的表单功能，都在这里</p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <MousePointerClick class="h-8 w-8 mb-2" />
            <CardTitle>拖拽设计</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">
              简单拖拽即可完成表单设计，所见即所得的编辑体验
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Palette class="h-8 w-8 mb-2" />
            <CardTitle>主题定制</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">
              支持自定义主题，轻松打造符合品牌调性的表单
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Database class="h-8 w-8 mb-2" />
            <CardTitle>数据管理</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">
              便捷的数据收集和管理功能，支持多种格式导出
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import UserButton from "@/components/common/UserButton.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, MousePointerClick, Palette } from "lucide-vue-next";
import { useRouter } from "vue-router";

const router = useRouter();
</script>
