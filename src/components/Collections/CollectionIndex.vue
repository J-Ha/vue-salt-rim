<template>
    <PageHeader>
        {{ $t('collections.title') }}
        <template #actions>
            <SaltRimDialog v-model="showDialog">
                <template #trigger>
                    <button type="button" class="button button--dark" @click.prevent="openDialog($t('collections.add'), {})">{{ $t('collections.add') }}</button>
                </template>
                <template #dialog>
                    <CollectionForm :source-collection="editCollection" :dialog-title="dialogTitle" @collection-dialog-closed="refreshCollections" />
                </template>
            </SaltRimDialog>
        </template>
    </PageHeader>
    <OverlayLoader v-if="isLoading" />
    <div v-if="collections.length > 0" class="block-container block-container--padded">
        <table class="table">
            <thead>
                <tr>
                    <th>{{ $t('name') }} / {{ $t('description') }}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="collection in collections" :key="collection.id">
                    <td>
                        <a href="#" @click.prevent="openDialog($t('collections.edit'), collection)">{{ collection.name }}</a>
                        <br>
                        <small>{{ collection.cocktails.length }} {{ $t('cocktails.title') }} &middot; {{ collection.description ? overflowText(collection.description, 100) : 'n/a' }}</small>
                    </td>
                    <td style="text-align: right;">
                        <a class="list-group__action" href="#" @click.prevent="shareCollection(collection)">{{ $t('share.title') }}</a>
                        &middot;
                        <RouterLink class="list-group__action" :to="{ name: 'cocktails', query: { 'filter[collection_id]': collection.id } }">{{ $t('view') }}</RouterLink>
                        &middot;
                        <a class="list-group__action" href="#" @click.prevent="deleteCollection(collection)">{{ $t('remove') }}</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <EmptyState v-else>
        <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                <path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1ZM5.49388 7.0777L13.0001 11.4234V20.11L19.5 16.3469V7.65311L12 3.311L5.49388 7.0777ZM4.5 8.81329V16.3469L11.0001 20.1101V12.5765L4.5 8.81329Z"></path>
            </svg>
        </template>
        <template #default>
            {{ $t('missing-collections') }}
        </template>
    </EmptyState>
</template>

<script>
import ApiRequests from './../../ApiRequests.js'
import OverlayLoader from './../OverlayLoader.vue'
import PageHeader from './../PageHeader.vue'
import SaltRimDialog from './../Dialog/SaltRimDialog.vue'
import CollectionForm from './CollectionForm.vue'
import EmptyState from './../EmptyState.vue'

export default {
    components: {
        OverlayLoader,
        PageHeader,
        SaltRimDialog,
        CollectionForm,
        EmptyState,
    },
    data() {
        return {
            isLoading: false,
            showDialog: false,
            dialogTitle: 'Collection data',
            editCollection: {},
            collections: [],
        }
    },
    created() {
        document.title = `${this.$t('collections.title')} \u22C5 ${this.site_title}`

        this.refreshCollections()
    },
    methods: {
        refreshCollections() {
            this.showDialog = false
            this.isLoading = true
            ApiRequests.fetchCollections().then(data => {
                this.collections = data
                this.isLoading = false
            }).catch(e => {
                this.$toast.error(e.message)
            })
        },
        openDialog(title, obj) {
            this.dialogTitle = title
            this.editCollection = obj
            this.showDialog = true
        },
        deleteCollection(collection) {
            this.$confirm(this.$t('collections.confirm-delete', { name: collection.name }), {
                onResolved: (dialog) => {
                    this.isLoading = true
                    dialog.close()
                    ApiRequests.deleteCollection(collection.id).then(() => {
                        this.isLoading = false
                        this.$toast.default(this.$t('collections.delete-success'))
                        this.refreshCollections()
                    }).catch(e => {
                        this.$toast.error(e.message)
                        this.isLoading = false
                    })
                }
            })
        },
        shareCollection(collection) {
            ApiRequests.shareCollection(collection.id).then(data => {
                navigator.clipboard.writeText(JSON.stringify(data)).then(() => {
                    this.$toast.default(this.$t('share.format-copied'))
                }, () => {
                    this.$toast.error(this.$t('share.format-copy-failed'))
                })
            })
        },
        overflowText(input, len) {
            if (!input) {
                return input
            }

            return input.length > len ? `${input.substring(0, len)}...` : input
        }
    }
}
</script>
