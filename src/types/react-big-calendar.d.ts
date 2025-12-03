declare module "react-big-calendar" {
    import * as React from "react";

    // ===============================
    // ✅ Base Types
    // ===============================
    export type View = "month" | "week" | "work_week" | "day" | "agenda";
    export type NavigateAction = "PREV" | "NEXT" | "TODAY" | "DATE";
    export type EventPropGetter<TEvent = Event> = (
        event: TEvent,
        start?: Date,
        end?: Date,
        isSelected?: boolean,
    ) => { style?: React.CSSProperties; className?: string };

    // ===============================
    // ✅ Event & SlotInfo
    // ===============================
    export interface Event {
        title: string;
        start: Date;
        end: Date;
        allDay?: boolean;
        resource?: any;
    }

    export interface SlotInfo {
        start: Date;
        end: Date;
        slots: Date[];
        action: "select" | "click" | "doubleClick";
        bounds?: {
            x: number;
            y: number;
            top: number;
            bottom: number;
            left: number;
            right: number;
        };
    }

    // ===============================
    // ✅ Views Enum
    // ===============================
    export const Views: {
        MONTH: "month";
        WEEK: "week";
        WORK_WEEK: "work_week";
        DAY: "day";
        AGENDA: "agenda";
    };

    // ===============================
    // ✅ Calendar Props
    // ===============================
    export interface CalendarProps<TEvent = Event> {
        localizer: any;
        events?: TEvent[];
        startAccessor?: string | ((event: TEvent) => Date);
        endAccessor?: string | ((event: TEvent) => Date);
        titleAccessor?: string | ((event: TEvent) => string);
        allDayAccessor?: string | ((event: TEvent) => boolean);
        tooltipAccessor?: string | ((event: TEvent) => string);
        resourceAccessor?: string | ((event: TEvent) => any);
        defaultView?: View;
        views?: View[] | Record<View, boolean>;
        style?: React.CSSProperties;
        className?: string;
        popup?: boolean;
        selectable?: boolean | "ignoreEvents";
        step?: number;
        timeslots?: number;
        min?: Date;
        max?: Date;
        culture?: string;
        messages?: Record<string, string>;
        formats?: Record<string, any>;
        components?: Record<string, any>;
        toolbar?: boolean;
        showMultiDayTimes?: boolean;
        dayLayoutAlgorithm?: "overlap" | "no-overlap" | ((args: any) => any);

        onSelectEvent?: (event: TEvent) => void;
        onSelectSlot?: (slotInfo: SlotInfo) => void;
        onNavigate?: (
            newDate: Date,
            view: View,
            action: NavigateAction,
        ) => void;
        onView?: (view: View) => void;
        onRangeChange?: (range: Date[] | { start: Date; end: Date }) => void;

        eventPropGetter?: EventPropGetter<TEvent>;
        view?: View;
        date?: Date;
        defaultDate?: Date;
        messagesId?: string;
    }

    // ===============================
    // ✅ Calendar & Localizer
    // ===============================
    export class Calendar<TEvent = Event> extends React.Component<
        CalendarProps<TEvent>
    > {}

    export function dateFnsLocalizer(config: {
        format: (date: Date, formatStr: string, options?: any) => string;
        parse: (value: string, formatStr: string, options?: any) => Date;
        startOfWeek: (date: Date, options?: any) => Date;
        getDay: (date: Date) => number;
        locales: Record<string, any>;
    }): any;
}

// ===============================
// ✅ Drag and Drop Addon
// ===============================
declare module "react-big-calendar/lib/addons/dragAndDrop" {
    import { Calendar } from "react-big-calendar";
    import * as React from "react";

    export interface DragAndDropProps<TEvent = any> {
        onEventDrop?: (args: {
            event: TEvent;
            start: Date;
            end: Date;
            allDay?: boolean;
        }) => void;
        onEventResize?: (args: {
            event: TEvent;
            start: Date;
            end: Date;
        }) => void;
        resizable?: boolean;
        draggableAccessor?: string | ((event: TEvent) => boolean);
        resizableAccessor?: string | ((event: TEvent) => boolean);
    }

    // HOC để thêm chức năng Drag & Drop cho Calendar
    export default function withDragAndDrop<TEvent = any>(
        component: typeof Calendar<TEvent>,
    ): React.ComponentType<
        React.ComponentProps<typeof Calendar<TEvent>> & DragAndDropProps<TEvent>
    >;
}
