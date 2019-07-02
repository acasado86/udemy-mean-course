import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Post } from './post.model';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient, private router: Router) { }

    getPosts() {
        this.http
            .get<{ message: string, posts: any }>(
                'http://localhost:3000/api/posts'
            )
            .pipe(map((postData) => {
                return postData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id,
                        imagePath: post.imagePath
                    };
                });
            }))
            .subscribe((posts) => {
                this.posts = posts;
                this.postsUpdated.next([...this.posts]);
            });
    }

    getPostsUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(id: string) {
        return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>(
            'http://localhost:3000/api/posts/' + id
        );
    }

    addPost(title: string, content: string, image: File) {
        // // tslint:disable-next-line:object-literal-shorthand
        // const post: Post = { id: null, title: title, content: content };
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
        this.http
            .post<{ message: string, post: Post }>(
                'http://localhost:3000/api/posts',
                postData
            )
            .subscribe((responseData) => {
                const post: Post = {
                    id: responseData.post.id,
                    title,
                    content,
                    imagePath: responseData.post.imagePath
                };
                // const id = responseData.postId;
                // post.id = id;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);
            });
    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;

        if (typeof (image) === 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        } else {
            postData = {
                id,
                title,
                content,
                imagePath: image
            };
        }

        this.http.put('http://localhost:3000/api/posts/' + id, postData)
            .subscribe((response) => {
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
                const post: Post = {
                    id,
                    title,
                    content,
                    imagePath: '' // response.imagePath
                };
                updatedPosts[oldPostIndex] = post;
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);
            });
    }

    deletePost(postId: string) {
        this.http.delete('http://localhost:3000/api/posts/' + postId)
            .subscribe(() => {
                const updatedPosts = this.posts.filter(post => post.id !== postId);
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
            });
    }
}
