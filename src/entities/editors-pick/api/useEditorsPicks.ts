import { useQuery } from "@tanstack/react-query";
import { editorsPickKeys } from "./editors-pick-keys";
import { fetchEditorsPicks } from "./editors-pick-api";

/** Редакционная подборка (чтение). */
export const useEditorsPicks = () =>
    useQuery({
        queryKey: editorsPickKeys.all,
        queryFn: fetchEditorsPicks,
    });
