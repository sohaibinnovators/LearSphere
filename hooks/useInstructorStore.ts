"use client";

import { useClientReady } from "@/hooks/useClientReady";
import { recordCoursePublishedEvent } from "@/lib/engagement/storage";
import {
  deleteCourse,
  emptyInstructorStore,
  getInstructorOwnedCourses,
  mergeCourseCatalog,
  readInstructorStore,
  resolvePublishedCourses,
  saveCourse,
  saveInstructorProfile,
  saveInstructorSettings,
  setCourseStatus,
} from "@/lib/instructor/storage";
import {
  INSTRUCTOR_STORAGE_KEY,
  type InstructorProfileData,
  type InstructorSettingsData,
  type InstructorStore,
} from "@/lib/instructor/types";
import type { Course } from "@/lib/types";
import { useEffect, useMemo, useSyncExternalStore } from "react";

const SERVER_SNAPSHOT: InstructorStore = emptyInstructorStore();
let memoryStore: InstructorStore = SERVER_SNAPSHOT;
let didHydrate = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setStore(next: InstructorStore) {
  memoryStore = next;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return memoryStore;
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function useInstructorStore() {
  const ready = useClientReady();
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!didHydrate) {
      memoryStore = readInstructorStore();
      didHydrate = true;
      emit();
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === INSTRUCTOR_STORAGE_KEY) {
        setStore(readInstructorStore());
      }
    };
    const onCustom = () => setStore(readInstructorStore());
    window.addEventListener("storage", onStorage);
    window.addEventListener("learnsphere-instructor-updated", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("learnsphere-instructor-updated", onCustom);
    };
  }, []);

  const myCourses = useMemo(
    () => getInstructorOwnedCourses(store),
    [store],
  );
  const catalog = useMemo(() => mergeCourseCatalog(store), [store]);
  const published = useMemo(
    () => resolvePublishedCourses(store),
    [store],
  );

  return {
    ready,
    store,
    profile: store.profile,
    settings: store.settings,
    myCourses,
    catalog,
    published,
    saveCourse: (course: Course) => {
      const previous =
        store.customCourses.find((item) => item.id === course.id) ??
        store.overrides[course.id];
      const wasPublished = previous?.status === "published";
      const next = saveCourse(course, store);
      setStore(next);
      if (course.status === "published" && !wasPublished) {
        recordCoursePublishedEvent(course);
      }
      return next;
    },
    setStatus: (courseId: string, status: "draft" | "published") => {
      const before = mergeCourseCatalog(store).find((item) => item.id === courseId);
      const next = setCourseStatus(courseId, status, store);
      setStore(next);
      if (status === "published" && before?.status !== "published") {
        const course = mergeCourseCatalog(next).find((item) => item.id === courseId);
        if (course) recordCoursePublishedEvent(course);
      }
      return next;
    },
    removeCourse: (courseId: string) => {
      const next = deleteCourse(courseId, store);
      setStore(next);
      return next;
    },
    saveProfile: (profile: InstructorProfileData) => {
      const next = saveInstructorProfile(profile, store);
      setStore(next);
      return next;
    },
    saveSettings: (settings: InstructorSettingsData) => {
      const next = saveInstructorSettings(settings, store);
      setStore(next);
      return next;
    },
    refresh: () => setStore(readInstructorStore()),
  };
}

export function useCourseCatalog() {
  const { ready, catalog, published } = useInstructorStore();
  return { ready, catalog, published };
}
