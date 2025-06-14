export interface TodoDto {
    title: string;
    priority: number;
    dueDate?: Date;
    completed: boolean;
  }
  export interface TodoDtoWithId extends TodoDto {
    id: number;
  }
  