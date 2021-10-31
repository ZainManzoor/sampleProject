import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { APIService, CreateTodoInput, Todo } from './API.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'amplify-angular-app';
  public createForm: FormGroup;
  public restaurants: Array<Todo> = [];
  private subscription: Subscription | null = null;

  constructor(private api: APIService, private fb: FormBuilder) {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  async ngOnInit() {
    /* fetch restaurants when app loads */
    this.api.ListTodos().then((event) => {
      this.restaurants = event.items as Todo[];
    });

    /* subscribe to new restaurants being created */
    this.subscription = <Subscription>(
      this.api.OnCreateTodoListener.subscribe((event: any) => {
        const newRestaurant = event.value.data.onCreateRestaurant;
        this.restaurants = [newRestaurant, ...this.restaurants];
      })
    );
  }
  public onCreate(restaurant: CreateTodoInput) {
    this.api
      .CreateTodo(restaurant)
      .then((event) => {
        console.log('item created!');
        this.createForm.reset();
      })
      .catch((e) => {
        console.log('error creating restaurant...', e);
      });
  }

 ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = null;
  }
}
